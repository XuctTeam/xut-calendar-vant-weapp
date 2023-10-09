/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 12:00:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 18:06:49
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\store\calendar.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import { IDavCalendar } from '~/../types/calendar'
import cache from '../cache'
import calendarApi from '../api/modules/calendar'

/**
 * @description: 日历集合
 * @return {*}
 */
export const calendarStore = atom<IDavCalendar[]>({
  key: 'calendarStore',
  default: (async () => {
    if (!cache.cacheGetSync('accessToken')) {
      return []
    }
    const res = await calendarApi.list().catch((err) => {
      console.log(err)
      return []
    })
    return res as any as IDavCalendar[]
  })()
})
