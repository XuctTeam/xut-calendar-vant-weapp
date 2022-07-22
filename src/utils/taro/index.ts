/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-26 10:50:22
 * @LastEditTime: 2022-07-22 18:26:51
 * @LastEditors: Derek Xu
 */
import Taro from '@tarojs/taro'
import Router, { NavigateType } from 'tarojs-router-next'
import useBack from './useBack'

export interface ToastOption {
  title: string
  duration?: number
  icon?: 'success' | 'loading' | 'error' | 'none'
  image?: string
  mask?: boolean
}

export interface BackOption {
  to: number
  data?: any
  delta?: number
}

/**
 * 清除所有登录信息
 */
export const pageCleanToLogin = () => {
  Taro.switchTab({
    url: '/pages/index/index'
  })
}

/**
 * 封装后退方法
 * @param backOption
 * @returns
 */
const back = (backOption: BackOption): Promise<TaroGeneral.CallbackResult> => {
  try {
    if (!backOption.delta) {
      return Router.back(backOption.data ? backOption.data : {})
    }
    return Router.back(backOption.data ? backOption.data : {}, {
      delta: backOption.delta
    })
  } catch (err) {
    console.log(err)
    switch (backOption.to) {
      case 2:
      //return Router.toContactmanager({ type: NavigateType.switchTab })
      case 3:
      //return Router.toMessagemanager({ type: NavigateType.switchTab })
      case 4:
        if (backOption.data && backOption.data.isLogin) {
          return Router.navigate({ url: '/pages/memberuserinfo/index' }, { type: NavigateType.redirectTo })
        }
        return Router.toMemberuserinfo({ type: NavigateType.switchTab })
      case 5:
        return Router.navigate({ url: '/pages/componentview/index' }, { type: NavigateType.redirectTo, params: backOption.data })
      case 6:
        return Router.navigate({ url: '/pages/login/index' }, { type: NavigateType.redirectTo })
      default:
        return Router.toIndex({ type: NavigateType.switchTab })
    }
  }
}

export { back, useBack }
