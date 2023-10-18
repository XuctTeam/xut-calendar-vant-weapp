/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 14:35:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-06-13 17:56:40
 * @FilePath: \xut-calendar-vant-weapp\types\global.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare module 'cos-wx-sdk-v5'
declare let wx: any
declare let my: any
declare let ks: any
declare let tt: any

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    TARO_ENV: 'weapp' | 'alipay' | 'h5' | 'tt' | 'kwai'
    API_ENV: 'stable' | 'real' | 'pre' | 'dev'
    WATCHING: 'true' | 'false'
    DEPLOY_VERSION: string
    APP_CLIENT: string
    WX_CLIENT: string
    TEMPLATE_ID: any
  }
}
