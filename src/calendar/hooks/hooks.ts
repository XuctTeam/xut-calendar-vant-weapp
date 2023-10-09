/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:58:29
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\hooks\hooks.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { nextTick, useDidShow as useDidShowInTaro, useRouter as useRouterInTaro } from '@tarojs/taro'
import { parse } from '@antmjs/utils'
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

export function useDidShow(fn: any): void {
  useDidShowInTaro(() => {
    // Taro的生命周期里面会先执行useDidShow，再执行useEffect(() => {//后执行}, [])
    // 这里加nextTick延后执行
    nextTick(fn)
  })
}

export function useRouter() {
  const routerInfo: Taro.RouterInfo = useRouterInTaro()
  if (process.env.TARO_ENV === 'h5') {
    const query = parse(location.search ? location.search.slice(1) : '')
    routerInfo.params = { ...routerInfo.params, ...query }
  }
}

export function useWebEnv() {
  return process.env.TARO_ENV === 'h5'
}

export function useWxBrowser() {
  const match = /(micromessenger)/i.test(navigator.userAgent)
  if (!match) {
    return false
  }
  return /(WindowsWechat)/i.test(navigator.userAgent) || /(wechatdevtools)/i.test(navigator.userAgent)
}

export function useNav() {
  const wx = useWxBrowser()
  const h5 = !useWebEnv()
  return wx && h5
}
