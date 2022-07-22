/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 13:13:28
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-22 13:15:09
 * @FilePath: \xut-calendar-vant-weapp\src\store\user.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { atom, RecoilState, selector } from 'recoil'
import { cacheGetSync } from '@/cache'
import { IUserInfo, IUserAuth } from '~/../@types/user'
import { baseUserInfo, auths } from '@/api/user'

const uuid = () => Math.random() // 生成一个唯一的id即可

/**
 * @description: 强制用户刷新
 * @return {*}
 */
export const userForceUpdateState = atom({
  key: 'userForceUpdateState',
  default: uuid()
})
/**
 * @description: 用户基础信息缓存
 * @return {*}
 */
export const userInfoStore = selector({
  key: 'userInfoStore',
  get: async ({ get }) => {
    get(userForceUpdateState)
    if (!cacheGetSync('accessToken')) {
      return undefined
    }
    try {
      const user: IUserInfo = await baseUserInfo()
      return user
    } catch (err) {
      console.log(err)
    }
    return undefined
  }
}) as RecoilState<IUserInfo | undefined>

/**
 * @description: 强制刷新用户认证方式
 * @return {*}
 */
export const userAuthForceUpdateState = atom({
  key: 'userAuthForceUpdateState',
  default: uuid()
})

export const userAuthInfoStore = selector({
  key: 'userAuthInfoStore',
  get: async ({ get }) => {
    const result: Array<IUserAuth> = []
    get(userAuthForceUpdateState)
    if (!cacheGetSync('accessToken')) {
      return result
    }
    return await auths()
  }
}) as RecoilState<Array<IUserAuth> | undefined>
