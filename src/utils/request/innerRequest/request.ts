/*
 * @Author: Derek Xu
 * @Date: 2022-07-15 14:52:03
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-21 13:32:16
 * @FilePath: \xut-calendar-vant-weapp\src\utils\request\innerRequest\request.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Taro from '@tarojs/taro'
import { cacheGetSync } from '@/cache'
import interceptors from './customInterceptor'
import { base64 } from '@/utils'

interceptors.forEach((interceptorItem) => Taro.addInterceptor(interceptorItem))

type RequestOpts = Omit<Taro.request.Option, 'url'>
type IAnyObject = Record<string, any>
type IReqData = string | IAnyObject | ArrayBuffer | any

//@ts-ignore
const BASE_URL = SERVICES_API

export default class httpRequest<T> {
  baseOptions(url: string, options: RequestOpts): Taro.RequestTask<T> {
    const header: IAnyObject = {
      'Content-Type': 'application/json',
      ...options?.header
    }

    if (!(url.includes('/uaa/sms') || url.includes('/uaa/captcha') || url.includes('/register'))) {
      /* 非登录接口都要通过token请求 */
      if (!url.includes('/oauth/token')) {
        header['Authorization'] = cacheGetSync('accessToken')
      } else {
        header['Authorization'] = this._clientAuth()
      }
    }
    if (options.header) delete options.header
    return Taro.request({
      url: BASE_URL + url,
      method: 'GET',
      ...options,
      header
    })
  }

  get(url: string, data?: IReqData): Taro.RequestTask<T> {
    return this.baseOptions(url, data ? { method: 'GET', data } : { method: 'GET' })
  }

  post(url: string, data: IReqData, contentType: string = 'application/json'): Taro.RequestTask<T> {
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

  exchage(url: string, opt: RequestOpts): Taro.RequestTask<T> {
    return this.baseOptions(url, opt)
  }

  _clientAuth = () => {
    return 'Basic ' + base64(process.env.CLIENT.CLIENT_ID + ':' + process.env.CLIENT.CLIENT_SECURITY)
  }
}
