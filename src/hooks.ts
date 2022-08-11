/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-11 11:11:33
 * @FilePath: \xut-calendar-vant-weapp\src\hooks.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { debounce, throttle } from 'lodash'
import { useCallback, useRef } from 'react'

// 两次点击相隔300ms内只执行最后一次
export function useDebounce(fn: any, ms?: number): any {
  const fRef: any = useRef()
  fRef.current = fn
  const result = useCallback(
    debounce((...args) => fRef.current(...args), ms ?? 300),
    []
  )
  return result
}

// 每隔300ms执行一次
export function useThrottle(fn: any, ms?: number): any {
  const fRef: any = useRef()
  fRef.current = fn
  const result = useCallback(
    throttle((...args) => fRef.current(...args), ms ?? 300),
    []
  )
  return result
}

//判断是否为web环境
export function useWebEnv(): boolean {
  return process.env.TARO_ENV === 'h5'
}

//判断是否在微信浏览器中
export function useWxBrowser(): boolean {
  if (/(micromessenger)/i.test(navigator.userAgent)) {
    //是否电脑微信或者微信开发者工具
    if (/(WindowsWechat)/i.test(navigator.userAgent) || /(wechatdevtools)/i.test(navigator.userAgent)) {
      return true
    } else {
      //手机微信打开的浏览器
      return true
    }
  } else {
    return false
  }
}
