/*
 * @Author: Derek Xu
 * @Date: 2023-10-09 17:48:19
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 18:00:13
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\hooks\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { useDebounce, useThrottle, useDidShow, useRouter, useWebEnv, useWxBrowser, useNav } from './hooks'
import { back, useBack } from './useBack'

export default {
  useDebounce,
  useThrottle,
  useDidShow,
  useRouter,
  useWebEnv,
  useNav,
  useWxBrowser,
  back,
  useBack
}
