/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 13:13:14
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 09:40:04
 * @FilePath: \xut-calendar-vant-weapp\src\store\component.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { atom } from 'recoil'

/**
 * @description: 事件刷新事件
 * @return {*}
 */
export const componentRefreshTimeStore = atom({
  key: 'componentRefreshTime',
  default: 0
})
