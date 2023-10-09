/* eslint-disable @typescript-eslint/no-shadow */
/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-28 21:26:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:52:10
 */
import { useCallback, useEffect, useRef } from 'react'
import Router, { NavigateType } from 'tarojs-router-next'

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

export type Back = (option?: Partial<BackOption>) => Promise<TaroGeneral.CallbackResult>

export const toIndex = () => {
  Router.navigate({ url: '/pages/index/index' }, { type: NavigateType.redirectTo })
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
        return Router.toAddressgroupesmanager({ type: NavigateType.switchTab })
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

const useBack = (option?: Partial<BackOption>): [Back] => {
  const initialOption = useRef<Partial<BackOption>>()

  useEffect(() => {
    initialOption.current = option
  }, [option])

  const backAsync = useCallback<Back>(
    (option?: Partial<BackOption>) => {
      return new Promise((resolve, reject) => {
        try {
          if (!option && !initialOption.current) {
            console.warn('please provide a option')
            return reject(new Error('please provide a option'))
          } else {
            const options = Object.assign({ to: 1 }, initialOption.current || {}, option || {})
            resolve(back({ ...(options as BackOption) }))
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    [initialOption]
  )
  return [backAsync]
}

export { back, useBack }
