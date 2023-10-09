/*
 * @Author: Derek Xu
 * @Date: 2022-07-15 14:52:03
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:01:26
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\api\config\request.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Taro from '@tarojs/taro'
import { DEFAULT_SERVICES, SECURITY_OAUTH2_IGNORE_URL } from '../../constants/url'
import { cacheGetSync } from '../../cache/cache'
import interceptors from './customInterceptor'

interceptors.forEach((interceptorItem) => Taro.addInterceptor(interceptorItem))

type RequestOpts = Omit<Taro.request.Option, 'url'>
type IAnyObject = Record<string, any>
type IReqData = string | IAnyObject | ArrayBuffer | any

export default class httpRequest<T> {
  baseOptions(url: string, options: RequestOpts): Taro.RequestTask<T> {
    const header: IAnyObject = {
      'Content-Type': 'application/json',
      ...options?.header
    }
    const match = SECURITY_OAUTH2_IGNORE_URL.some((item) => url.indexOf(item) > -1)
    if (!match) {
      /* 非登录接口都要通过token请求 */
      if (!url.includes('/oauth2/token')) {
        header['Authorization'] = cacheGetSync('accessToken')
      } else {
        header['Authorization'] = 'Basic ' + (process.env.TARO_ENV === 'h5' ? process.env.APP_CLIENT : process.env.WX_CLIENT)
      }
    }
    if (options.header) delete options.header
    return Taro.request({
      url: DEFAULT_SERVICES + url,
      method: 'GET',
      ...options,
      header
    })
  }

  get(url: string, data?: IReqData): Taro.RequestTask<T> {
    return this.baseOptions(url, data ? { method: 'GET', data } : { method: 'GET' })
  }

  post(url: string, data: IReqData, contentType = 'application/json'): Taro.RequestTask<T> {
    return this.baseOptions(url, {
      method: 'POST',
      data,
      header: { 'Content-Type': contentType }
    })
  }

  put(url: string, data: IReqData): Taro.RequestTask<T> {
    return this.baseOptions(url, { method: 'PUT', data })
  }

  delete(url: string, data?: IReqData): Taro.RequestTask<T> {
    return this.baseOptions(url, data ? { method: 'DELETE', data } : { method: 'DELETE' })
  }

  exchange(url: string, opt: RequestOpts): Taro.RequestTask<T> {
    return this.baseOptions(url, opt)
  }
}
