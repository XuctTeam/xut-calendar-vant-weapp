/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-12 12:49:07
 * @LastEditTime: 2022-07-15 20:05:37
 * @LastEditors: Derek Xu
 */
import { tokenRefresh } from '@/api/login'
import dayjs from 'dayjs'
import httpRequest from './index'
import { pageCleanToLogin } from '../../taro'
import { cacheSetSync, cacheGetSync } from '@/cache'
import { useToast } from 'taro-hooks'
import { useCallback } from 'react'

interface ITask<T> {
  url: string
  opt: Taro.RequestParams<T>
  resolve: (value: unknown) => void
  reject: (value: unknown) => void
}

const [show] = useToast({
  title: '提示',
  icon: 'error'
})

const error = useCallback(
  (message: string) => {
    show({
      title: message
    })
  },
  [show]
)

class RefreshSubscribers {
  private _refresh: number = 0
  private _isRefreshing: boolean = false
  private _refreshSubscribers: Array<any> = []

  set isRefreshing(value: boolean) {
    this._isRefreshing = value
  }

  get isRefreshing() {
    return this._isRefreshing
  }

  get refresh() {
    return this._refresh
  }

  /**
   * @description 清除所有缓存任务
   */
  cleanTask() {
    this._refreshSubscribers.forEach((task) => {
      task.reject('refresh error')
    })
    this._isRefreshing = false
    this._refreshSubscribers.length = 0
  }

  /**
   * @description 添加异步任务
   * @param promiseTask
   *
   */
  pushTask(promiseTask: ITask<Promise<any>>) {
    this._refreshSubscribers.push(promiseTask)
  }

  /**
   * @description 进行刷新
   */
  async pageRefreshToken() {
    const reToken: string | undefined = cacheGetSync('refreshToken')
    if (!reToken) {
      return this.fail()
    }
    const result: any = await tokenRefresh(reToken.replace('Bearer ', ''))
    if (!result) return
    cacheSetSync('accessToken', 'Bearer ' + result.access_token)
    cacheSetSync('refreshToken', 'Bearer ' + result.refresh_token)
    console.log('taro util:: refresh token success , refreshToken  = ' + reToken)
    this._refresh = dayjs().unix()
    setTimeout(() => {
      this.onRrefreshed()
    }, 200)
    return true
  }

  /**
   * @description 刷新成功后回调
   */
  onRrefreshed() {
    if (this._refreshSubscribers.length > 0) {
      this._refreshSubscribers.forEach((task) => {
        task.resolve(httpRequest.exchage(task.url, task.opt))
      })
      this._isRefreshing = false
      this._refreshSubscribers.length = 0
    }
  }

  fail() {
    error('获取登录信息失败')
    this.cleanTask()
    setTimeout(() => {
      pageCleanToLogin()
    }, 500)
    return false
  }

  /**
   * @description 封装异常处理
   * @param response
   * @returns
   */
  async convertError(response: any) {
    if (!response.status || response.source) return response
    return await response.json().then((json: any) => {
      return {
        status: response.status,
        code: json.code,
        statusText: json.msg ? json.msg : json.error ? json.error : ''
      }
    })
  }
}

export default new RefreshSubscribers()
