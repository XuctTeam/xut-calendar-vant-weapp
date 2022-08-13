/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 14:35:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-08 15:06:23
 * @FilePath: \xut-calendar-vant-weapp\types\global.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/// <reference types="@tarojs/taro" />

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
    CLIENT: any
    TEMPLATE_ID: any
  }
}