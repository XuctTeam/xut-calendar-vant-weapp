/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 12:00:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-07 09:08:28
 * @FilePath: \xut-calendar-vant-weapp\src\store\calendar.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import { cacheGetSync } from '@/cache'
import { IDavCalendar } from '~/../@types/calendar'
import { list } from '@/api/calendar'


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
    const _list = await  await list()
    return _list as any as IDavCalendar[]
    })()
  })



