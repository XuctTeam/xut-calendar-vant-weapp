import { atom, selector } from 'recoil'
import { cacheGetSync, cacheSetSync } from '../cache/cache'

/*
 * @Author: Derek Xu
 * @Date: 2022-08-01 11:45:21
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 09:28:37
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\store\system.ts
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
  default: cacheGetSync('compView') || 'month'
})

export const compViewStore = selector({
  key: 'compViewStore',
  get: ({ get }) => {
    return get(compViewState)
  },
  set: ({ set }, newValue) => {
    set(compViewState, newValue)
    cacheSetSync('compView', newValue === 'month' ? 'month' : 'week')
  }
})
