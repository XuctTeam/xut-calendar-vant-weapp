/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-09 09:11:18
 * @LastEditTime: 2022-07-28 14:32:45
 * @LastEditors: Derek Xu
 */
import Taro, { Chain } from '@tarojs/taro'
import dayjs from 'dayjs'
import { HTTP_STATUS } from './statusCode'
import codeMessage from './codeMessage'
import refreshSubscribers from './refreshSubscribers'
import { IRequestResponse } from '../constants'
import { cacheGetSync } from '@/cache'

const OAUTHTOKEN_URL: string = '/oauth/token'
const codeKeys = codeMessage as { [key: string]: any }

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
      if (res.statusCode === HTTP_STATUS.NOT_FOUND || res.statusCode === HTTP_STATUS.BAD_GATEWAY || res.statusCode === HTTP_STATUS.CLIENT_ERROR) {
        return Promise.reject({
          source: 'interceptor',
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
            source: 'interceptor',
            status: res.statusCode,
            statusText: res.data.message || codeKeys[res.data.code]
          })
        }
        return resolve(res.data.data)
      }
      return Promise.reject({
        source: 'interceptor',
        status: res.statusCode,
        code: res.data.code,
        statusText: res.data.message || codeKeys[res.data.code]
      })
    }).catch(async (error: any) => {
      const { status, statusText, code, errMsg } = await refreshSubscribers.convertError(error)
      /** 非认证失败 */
      if (!status) {
        Taro.showToast({
          icon: 'error',
          title: '请求异常',
          duration: 1500
        })
        return reject(error)
      }
      if (status !== HTTP_STATUS.AUTHENTICATE) {
        let toastMsg: string = statusText
        if (!toastMsg && errMsg) {
          toastMsg = errMsg
        }
        if (!toastMsg && (status === 500 || status === 502 || status === 503 || status === 504)) {
          toastMsg = codeKeys[status]
        }
        /** 兼容刷新token 异常情况*/
        if (url.includes(OAUTHTOKEN_URL)) {
          refreshSubscribers.cleanTask()
        }
        Taro.showToast({
          icon: 'error',
          title: toastMsg,
          duration: 1500
        })
        return reject(error)
      }

      /* 1.刷新token认证失败，清空并返回登录 */
      // if (url.includes(OAUTHTOKEN_URL) && requestParams.data && requestParams.data['refresh_token']) {
      //   debugger
      //   Taro.showToast({
      //     icon: 'error',
      //     title: '获取登录信息失败',
      //     duration: 1500
      //   })
      //   refreshSubscribers.cleanTask()
      //   pageCleanToLogin()
      //   return reject(error)
      // }

      /* 2.认证失败且不是token过期 */
      if (status === HTTP_STATUS.AUTHENTICATE && code !== HTTP_STATUS.AUTHENTICATE) {
        Taro.showToast({
          icon: 'error',
          title: codeKeys[code],
          duration: 1500
        })
        return reject(error)
      }
      let refreshToken = cacheGetSync('refreshToken')
      const now = dayjs().unix()
      /* 3. 刷新token时间不小于2个小时 或 不存在刷新token  */
      if (now - refreshSubscribers.refresh < 7200 || !refreshToken) {
        Taro.showToast({
          icon: 'error',
          title: codeKeys[status],
          duration: 1500
        })
        return reject(error)
      }

      if (!refreshSubscribers.isRefreshing) {
        refreshSubscribers.isRefreshing = true
        refreshSubscribers.pageRefreshToken()
      }
      return new Promise((rev, rej) => {
        refreshSubscribers.pushTask({
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
