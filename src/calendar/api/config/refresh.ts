/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-12 12:49:07
 * @LastEditTime: 2023-10-10 08:32:34
 * @LastEditors: Derek Xu
 */
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { cacheSetSync, cacheGetSync, cacheRemoveSync } from '@/calendar/cache/cache'
import loginApi from '../modules/login'
import { toIndex } from '../../hooks/useBack'
import httpRequest from './index'

interface ITask<T> {
  url: string
  opt: Taro.RequestParams<T>
  resolve: (value: unknown) => void
  reject: (value: unknown) => void
}

class Refresh {
  private _refresh = 0
  private _isRefreshing = false
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
    const result: any = await loginApi.tokenRefresh(reToken.replace('Bearer ', '')).catch((err) => {
      console.log(err)
      return
    })
    if (!result) return
    cacheSetSync('accessToken', 'Bearer ' + result.access_token)
    cacheSetSync('refreshToken', 'Bearer ' + result.refresh_token)
    console.log('taro util:: refresh token success , refreshToken  = ' + reToken)
    this._refresh = dayjs().unix()
    setTimeout(() => {
      this.onRefresh()
    }, 200)
    return true
  }

  /**
   * @description 刷新成功后回调
   */
  onRefresh() {
    if (this._refreshSubscribers.length > 0) {
      this._refreshSubscribers.forEach((task) => {
        task.resolve(httpRequest.exchange(task.url, task.opt))
      })
      this._isRefreshing = false
      this._refreshSubscribers.length = 0
    }
  }

  fail() {
    Taro.showToast({
      title: '获取登录信息失败',
      icon: 'success'
    })
    this.cleanTask()
    cacheRemoveSync('accessToken')
    cacheRemoveSync('refreshToken')
    setTimeout(() => {
      toIndex()
    }, 500)
    return false
  }

  getParams(url: string) {
    if (url.indexOf('?') === -1) {
      return url
    }
    const index = url.indexOf('?')
    const str = url.substring(index + 1, url.length)
    const data = str.split('&')
    return data.map((item) => {
      const param = item.split('=')
      return {
        key: param[0],
        value: param[1]
      }
    })
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

export default new Refresh()
