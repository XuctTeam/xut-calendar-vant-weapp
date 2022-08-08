/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 13:13:28
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-07 11:58:50
 * @FilePath: \xut-calendar-vant-weapp\src\store\user.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import { cacheGetSync } from '@/cache'
import { IUserInfo, IUserAuth } from '~/../types/user'
import { baseUserInfo, auths } from '@/api/user'

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
    return await baseUserInfo()
  })(),
})

export const userAuthInfoStore = atom<Array<IUserAuth> | undefined>({
  key: 'userAuthInfoStore',
  default: (async () => {
    if (!cacheGetSync('accessToken')) {
      return []
    }
    return await auths()
  })(),
})
