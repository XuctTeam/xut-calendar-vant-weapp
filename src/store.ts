/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 10:00:09
 * @FilePath: \xut-calendar-vant-weapp\src\store.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom, RecoilState } from 'recoil'
import { calendarStore } from '@/store/calendar'
import { componentRefreshTimeStore } from '@/store/component'
import { groupRefreshTimeStore } from '@/store/group'
import { userInfoStore, userAuthInfoStore } from '@/store/user'
import { lunarStore, mondayStore, compViewStore } from '@/store/system'

export interface IMenuButton {
  // 用来判断是否同时通过systemInfo+menuButton得出来的数据
  precise: boolean
  bottom: number
  width: number
  height: number
  left: number
  right: number
  marginRight: number
  top: number
  statusBarHeight: number
}

// 和UI有关的全局数据存储在这里，和UI无关的全局数据存储在cache.ts文件中
/**
 * @description: 微信头部自定义按钮
 * @return {*}
 */
const menuButtonStore = atom({
  key: 'menuButtonStore',
  default: undefined
}) as RecoilState<IMenuButton | undefined>

export {
  menuButtonStore,
  calendarStore,
  componentRefreshTimeStore,
  userInfoStore,
  userAuthInfoStore,
  lunarStore,
  mondayStore,
  compViewStore,
  groupRefreshTimeStore
}
