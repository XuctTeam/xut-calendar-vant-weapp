/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 13:13:28
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 11:16:17
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\store\user.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom } from 'recoil'
import cache from '../cache'
import userApi from '../api/modules/user'
import { asyncPackage } from '../utils'
import { User } from '../api/interface'

/**
 * @description: 用户缓存信息
 * @return {*}
 */
export const userInfoStore = atom<User.IUserInfo | undefined>({
  key: 'userInfoStore',
  default: (async () => {
    if (!cache.cacheGetSync('accessToken')) {
      return undefined
    }
    const [err, res] = await asyncPackage(userApi.baseUserInfo())
    if (err) {
      return undefined
    }
    return res.data
  })()
})

export const userAuthInfoStore = atom<Array<User.IUserAuth> | undefined>({
  key: 'userAuthInfoStore',
  default: (async () => {
    if (!cache.cacheGetSync('accessToken')) {
      return []
    }
    const [err, res] = await await asyncPackage(userApi.auths())
    if (err) {
      return []
    }
    return res.data
  })()
})
