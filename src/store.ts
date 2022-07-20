/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-18 15:08:50
 * @FilePath: \xut-calendar-vant-weapp\src\store.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom, RecoilState, selector } from 'recoil'
import { cacheGetSync } from './cache'
import { IDavCalendar } from '~/../@types/calendar'
import { list } from '@/api/calendar'

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
export const menuButtonStore = atom({
  key: 'menuButtonStore',
  default: undefined
}) as RecoilState<IMenuButton | undefined>

/**
 * @description: 日历强刷key
 * @return {*}
 */
const uuid = () => Math.random() // 生成一个唯一的id即可
const forceUpdateState = atom({
  key: 'forceUpdateState',
  default: uuid()
})
/**
 * @description: 日历集合
 * @return {*}
 */
export const calendarState = selector({
  key: 'calendarStore',
  get: async ({ get }) => {
    get(forceUpdateState) // 我们可以将forceUpdateState作为依赖，当forceUpdateState值变化时，重新计算msgListState的值
    if (!cacheGetSync('accessToken')) {
      return []
    }
    try {
      const array = await list()
      return array as any as IDavCalendar[]
    } catch (err) {
      console.log(err)
    }
    return []
  }
})

/**
 * @description: 事件刷新事件
 * @return {*}
 */
export const componentRefreshTimeStore = atom({
  key: 'componentRefreshTime',
  default: 0
})
