/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 13:13:28
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-26 18:44:45
 * @FilePath: \xut-calendar-vant-weapp\src\store\user.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import { cacheGetSync } from '@/calendar/cache/cache'
import { IUserInfo, IUserAuth } from '~/../types/user'
import { baseUserInfo, auths } from '@/calendar/api/modules/user'

/**
 * @description: 用户缓存信息
 * @return {*}
 */
export const userInfoStore = atom<IUserInfo | undefined>({
  key: 'userInfoStore',
  default: (async () => {
    if (!cacheGetSync('accessToken')) {
      return undefined
    }
    const res = await baseUserInfo().catch((err) => {
      console.log(err)
      return undefined
    })
    return res
  })()
})

export const userAuthInfoStore = atom<Array<IUserAuth> | undefined>({
  key: 'userAuthInfoStore',
  default: (async () => {
    if (!cacheGetSync('accessToken')) {
      return []
    }
    const res = await auths().catch((err) => {
      console.log(err)
      return []
    })
    return res
  })()
})
