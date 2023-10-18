import Taro from '@tarojs/taro'
import { DEFAULT_SERVICES, SECURITY_OAUTH2_IGNORE_URL } from '../../constants/url'
import ajax from '../config'
import { cacheGetSync } from '../../cache/cache'
import codeMessage from './codeMessage'
import { showFullScreenLoading, tryHideFullScreenLoading } from './serviceLoading'
import port from './port'

interface RequestTaskQuery {
  resolve: any
  reject: any
}

const codeKeys = codeMessage as { [key: string]: any }
const instance = ajax.create({
  baseURL: DEFAULT_SERVICES
})

let isRefreshing = false // 当前是否在请求刷新 Token
let requestQueue: RequestTaskQuery[] = [] // 将在请求刷新 Token 中的请求暂存起来，等刷新 Token 后再重新请求

const OAUTH_TOKEN_URL = '/oauth2/token'

// 执行暂存起来的请求
const executeQueue = (error: any) => {
  requestQueue.forEach((promise: RequestTaskQuery) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })

  requestQueue = []
}

// 验证 Token 请求
const checkToken = () => instance.post(port.UAA + `/oauth2/token?grant_type=refresh_token&refresh_token=${cacheGetSync('refreshToken')}`, {})

// 验证 Token 请求处理，参数为刷新成功后的回调函数
const checkTokenHandler = (afresh: any) => {
  // 如果当前是在请求刷新 Token 中，则将期间的请求暂存起来
  if (isRefreshing) {
    return new Promise((resolve: any, reject: any) => {
      requestQueue.push({ resolve, reject })
    }).then(afresh)
  }

  isRefreshing = true

  return new Promise((resolve, reject) => {
    checkToken()
      // 假设请求成功接口返回的 code === 0 为刷新成功，其他情况都是刷新失败
      .then((res: any) => {
        return res.code === 200 && res.data ? res : Promise.reject(res)
      })
      .then(() => {
        resolve(afresh?.())
        executeQueue(null)
      })
      .catch((err) => {
        //store.logout()
        reject(err)
        executeQueue(err)
      })
      .finally(() => {
        isRefreshing = false
      })
  })
}

instance.interceptors.request.use(
  (config: any) => {
    const header: TaroGeneral.IAnyObject = {
      'Content-Type': 'application/json',
      ...config?.header
    }
    const match = SECURITY_OAUTH2_IGNORE_URL.some((item) => config.url.indexOf(item) > -1)
    if (!match) {
      /* 非登录接口都要通过token请求 */
      if (!config.url.includes(OAUTH_TOKEN_URL)) {
        header['Authorization'] = cacheGetSync('accessToken')
      } else {
        header['Authorization'] = 'Basic ' + (process.env.TARO_ENV === 'h5' ? process.env.APP_CLIENT : process.env.WX_CLIENT)
      }
    }
    config.header = header
    config.noLoading || showFullScreenLoading()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    tryHideFullScreenLoading()
    if (response.config.url?.includes(OAUTH_TOKEN_URL) && response.statusCode === 200) {
      return { data: response.data }
    }
    const { code, message } = response.data
    if (code !== 200) {
      Taro.showToast(message || '请求异常')
      return Promise.reject({
        error: code,
        message
      })
    }
    return response.data
  },
  (error) => {
    tryHideFullScreenLoading()
    const url = error.config.url
    const { statusCode, statusText, data } = error

    // 假设接口返回的 code === 401 时则需要刷新 Token
    if (statusCode === 401) {
      const params = getParams(url)
      if (params && params.length > 0) {
        //刷新接口异常,接着退出
        const refreshToken = params.find((item) => item.key === 'refresh_token')
        if (refreshToken) {
          return Promise.reject('')
        }
      }
      if (url.includes(OAUTH_TOKEN_URL)) {
        const { code, message } = data
        const msg = message ?? codeKeys[code ?? statusCode] ?? statusText
        Taro.showToast({
          icon: 'error',
          title: msg
        })
        return Promise.reject(msg)
      }
      return checkTokenHandler(() => instance(error.config))
    }
    Taro.showToast({
      icon: 'error',
      title: codeKeys[statusCode] || '请求异常'
    })
    return Promise.reject(error)
  }
)

function getParams(url: string) {
  if (url.indexOf('?') === -1) {
    return []
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

export default instance
