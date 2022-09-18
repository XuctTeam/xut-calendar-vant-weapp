/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-09 09:11:18
 * @LastEditTime: 2022-09-18 16:12:40
 * @LastEditors: Derek Xu
 */
import Taro, { Chain } from '@tarojs/taro'
import dayjs from 'dayjs'
import { HTTP_STATUS } from './statusCode'
import codeMessage from './codeMessage'
import refresh from './refresh'
import { IRequestResponse } from '../constants'
import { pageCleanToLogin } from '../../taro'
import { cacheGetSync } from '@/cache'

const OAUTHTOKEN_URL: string = '/oauth2/token'
const codeKeys = codeMessage as { [key: number]: any }

const customInterceptor = (chain: Chain): Promise<any> => {
  const requestParams = chain.requestParams
  const url = chain.requestParams.url
  let p
  const result = new Promise(function (resolve: (res: any) => void, reject) {
    p = chain.proceed(requestParams)
    p.then((res: Taro.request.SuccessCallbackResult<IRequestResponse>) => {
      if (!res) {
        reject()
        return
      }
      const { statusCode } = res
      if (statusCode === HTTP_STATUS.NOT_FOUND || statusCode === HTTP_STATUS.BAD_GATEWAY || statusCode === HTTP_STATUS.CLIENT_ERROR) {
        return Promise.reject({
          status: res.statusCode,
          statusText: codeMessage[res.statusCode]
        })
      }

      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        if (url.includes(OAUTHTOKEN_URL)) {
          return resolve(res.data)
        }
        if (res.data.code !== 200) {
          return Promise.reject({
            status: res.statusCode,
            statusText: res.data.message || codeKeys[res.data.code]
          })
        }
        return resolve(res.data.data)
      }
      return Promise.reject({
        status: res.statusCode,
        code: res.data.code,
        statusText: res.data.message || codeKeys[res.data.code]
      })
    }).catch((error: any) => {
      const { status } = error
      //不是刷新token异常
      if (HTTP_STATUS.FAILED_DEPENDENCY !== status) {
        let msg = '请求异常'
        if (HTTP_STATUS.AUTHENTICATE === status || HTTP_STATUS.SERVICE_UNAVAILABLE === status) {
          msg = codeKeys[status]
        }
        Taro.showToast({
          icon: 'error',
          title: msg,
          duration: 1500
        })
        return reject(error)
      }
      if (url.indexOf(OAUTHTOKEN_URL) > -1) {
        refresh.cleanTask()
        pageCleanToLogin()
        return reject('refresh token error')
      }
      if (!refresh.isRefreshing) {
        refresh.isRefreshing = true
        refresh.pageRefreshToken()
      }
      return new Promise((rev, rej) => {
        refresh.pushTask({
          resolve: rev,
          reject: rej,
          url: url,
          opt: requestParams
        })
      })
        .then((rs: any) => {
          resolve(rs)
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
  return result
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。

const chainInterceptor = [customInterceptor, Taro.interceptors.logInterceptor]

export default chainInterceptor
