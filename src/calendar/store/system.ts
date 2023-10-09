import { atom, selector } from 'recoil'
import { cacheGetSync, cacheSetSync } from '@/calendar/cache/cache'

/*
 * @Author: Derek Xu
 * @Date: 2022-08-01 11:45:21
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-06 21:36:50
 * @FilePath: \xut-calendar-vant-weapp\src\store\system.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
const lunarState = atom({
  key: 'lunarState',
  default: cacheGetSync('lunarView') || false
})

export const lunarStore = selector({
  key: 'lunarStore',
  get: ({ get }) => {
    const rs: boolean = get(lunarState)
    return rs
  },
  set: ({ set }, newValue) => {
    set(lunarState, newValue)
    cacheSetSync('lunarView', newValue ? true : false)
  }
})

const mondayState = atom({
  key: 'mondayState',
  default: cacheGetSync('mondayView') || false
})

export const mondayStore = selector({
  key: 'mondayStore',
  get: ({ get }) => {
    const rs: boolean = get(mondayState)
    return rs
  },
  set: ({ set }, newValue) => {
    set(mondayState, newValue)
    cacheSetSync('mondayView', newValue ? true : false)
  }
})

const compViewState = atom({
  key: 'compViewState',
  default: cacheGetSync('compView') || 'day'
})

export const compViewStore = selector({
  key: 'compViewStore',
  get: ({ get }) => {
    return get(compViewState)
  },
  set: ({ set }, newValue) => {
    set(compViewState, newValue)
    cacheSetSync('compView', newValue === 'list' ? 'list' : 'day')
  }
})
