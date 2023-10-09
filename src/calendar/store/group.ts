/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 09:57:21
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 09:59:59
 * @FilePath: \xut-calendar-vant-weapp\src\store\group.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'

/**
 * @description: 事件刷新事件
 * @return {*}
 */
export const groupRefreshTimeStore = atom({
  key: 'groupRefreshTime',
  default: 0
})
