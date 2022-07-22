/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 12:00:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-22 18:01:57
 * @FilePath: \xut-calendar-vant-weapp\src\store\calendar.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom, RecoilState, selector } from 'recoil'
import { cacheGetSync } from '@/cache'
import { IDavCalendar } from '~/../@types/calendar'
import { list } from '@/api/calendar'

const uuid = () => Math.random() // 生成一个唯一的id即可

const calendars = (): Array<IDavCalendar> => {
  return []
}

/**
 * @description: 日历强刷key
 * @return {*}
 */
export const calendarForceUpdateState = atom({
  key: 'calendarForceUpdateState',
  default: uuid()
})

const calendarQuery = selector({
  key: 'calendarQuery',
  get: async ({}) => {
    // 我们可以将forceUpdateState作为依赖，当forceUpdateState值变化时，重新计算msgListState的值
    return await list()
  }
})

/**
 * @description: 日历集合
 * @return {*}
 */
export const calendarStore = atom({
  key: 'calendarStore',
  default: selector({
    key: 'calendarStore/default',
    get: ({ get }) => {
      get(calendarForceUpdateState)
      if (!cacheGetSync('accessToken')) {
        return calendars()
      }
      return get(calendarQuery)
    }
  })
}) as RecoilState<IDavCalendar[] | undefined>
