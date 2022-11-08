/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-09 09:11:18
 * @LastEditTime: 2022-11-08 16:56:20
 * @LastEditors: Derek Xu
 */
import Taro, { Chain } from '@tarojs/taro'
import { HTTP_STATUS } from './statusCode'
import codeMessage from './codeMessage'
import refresh from './refresh'

const OAUTHTOKEN_URL: string = '/oauth2/token'
const codeKeys = codeMessage as { [key: number]: any }

interface IRequestResponse {
  code: number
  success: boolean
  data: any
  message: string
}

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
      const { statusCode, data } = res
      if (statusCode !== 200) {
        return Promise.reject({
          status: res.statusCode,
          message: data.message
        })
      }
      if (url.includes(OAUTHTOKEN_URL)) {
        return resolve(data)
      }
      const { code, message } = data
      if (code !== 200) {
        return Promise.reject({
          status: 200,
          message
        })
      }
      return resolve(data.data)
    }).catch((error: any) => {
      const { status, statusText, message } = error
      /** 网络问题直接返回 */
      if (!status) {
        Taro.showToast({
          icon: 'error',
          title: '请求异常',
          duration: 1500
        })
        return reject(error)
      }
      /** 不是刷新token异常  */
      if (HTTP_STATUS.FAILED_DEPENDENCY !== status && HTTP_STATUS.AUTHENTICATE !== status) {
        let msg = ''
        if (HTTP_STATUS.BAD_GATEWAY === status || HTTP_STATUS.SERVICE_UNAVAILABLE === status || HTTP_STATUS.GATEWAY_TIMEOUT === status) {
          msg = codeKeys[status]
        }
        if (!msg && message) {
          msg = message
        }
        if (!msg) {
          msg = '请求异常'
        }
        Taro.showToast({
          icon: 'error',
          title: msg,
          duration: 1500
        })
        return reject(error)
      }
      if (HTTP_STATUS.FAILED_DEPENDENCY === status && !url.includes(OAUTHTOKEN_URL)) {
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
      }
      if (status === HTTP_STATUS.AUTHENTICATE) {
        if (url.includes(OAUTHTOKEN_URL)) {
          if (requestParams && requestParams.data) {
            const { grant_type } = requestParams.data
            if (grant_type && grant_type === 'refresh_token') {
              refresh.fail()
              return reject('refresh token error')
            }
          }
        }
      }
      let msg = message || codeKeys[status] || statusText
      Taro.showToast({
        icon: 'error',
        title: msg,
        duration: 1500
      })
      return reject(error)
    })
  })
  return result
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。

const chainInterceptor = [customInterceptor, Taro.interceptors.logInterceptor]

export default chainInterceptor
