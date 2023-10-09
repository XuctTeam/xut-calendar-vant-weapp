/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 12:00:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-26 18:43:30
 * @FilePath: \xut-calendar-vant-weapp\src\store\calendar.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import { cacheGetSync } from '@/calendar/cache/cache'
import { IDavCalendar } from '~/../types/calendar'
import { list } from '@/calendar/api/modules/calendar'

/**
 * @description: 日历集合
 * @return {*}
 */
export const calendarStore = atom<IDavCalendar[]>({
  key: 'calendarStore',
  default: (async () => {
    if (!cacheGetSync('accessToken')) {
      return []
    }
    const res = await list().catch((err) => {
      console.log(err)
      return []
    })
    return res as any as IDavCalendar[]
  })()
})
