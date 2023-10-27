/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 12:00:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-27 08:44:09
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\store\calendar.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import cache from '../cache'
import calendarApi from '../api/modules/calendar'
import { asyncPackage } from '../utils'
import { Calendar } from '../api/interface'
import { atom, selector } from 'recoil'

const calendarState = atom<Calendar.IDavCalendar[]>({
  key: 'calendarState',
  default: (async () => {
    if (!cache.cacheGetSync('accessToken')) {
      return []
    }
    const [err, res] = await asyncPackage(calendarApi.list())
    if (err) {
      return []
    }
    return res.data
  })()
})
/**
 * @description: 日历集合
 * @return {*}
 */
export const calendarStore = selector({
  key: 'calendarStore',
  get: ({ get }) => {
    return get(calendarState)
  },
  set: ({ set }, newValue) => {
    set(calendarState, newValue)
  }
})
