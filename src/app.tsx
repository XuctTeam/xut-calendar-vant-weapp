/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-26 19:09:47
 * @FilePath: \xut-calendar-vant-weapp\src\app.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import { useWxBrowser } from '@/hooks'
import { useDidShow, useDidHide, getUpdateManager, showModal, nextTick, useReady } from '@tarojs/taro'
import { setSysInfoAsync, setWxBrower } from '@/utils'
import * as dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/zh-cn'

import './cache'
import './app.less'
import './router'

interface IProps {
  children: React.ReactNode
}

/** 日期国际化 */
dayjs.extend(isLeapYear) // use plugin
dayjs.locale('zh-cn') // use locale

export default function App(props: IProps) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    console.log('app launch')
    //保存浏览器配置
    setWxBrower(useWxBrowser())
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 对应 onShow
  useDidShow(() => {
    nextTick(() => {
      setSysInfoAsync()
      if (process.env.TARO_ENV !== 'h5') {
        const updateManager: any = getUpdateManager()
        updateManager.onCheckForUpdate(async (res: any) => {
          if (res.hasUpdate) {
          }
        })
        updateManager.onUpdateReady(() => {
          showModal({
            title: '更新提示',
            content: '新版本已经准备好，立即重启应用？',
            confirmText: '我知道了',
            showCancel: false
          }).then(function (mRes: any): void {
            if (mRes.confirm) {
              updateManager.applyUpdate()
            }
          })
        })

        updateManager.onUpdateFailed(() => {
          showModal({
            title: '更新失败',
            content: '请删除小程序后重新打开',
            confirmText: '我知道了',
            showCancel: false
          }).then(function (): void {})
        })
      }
    })
  })

  // 对应 onHide
  useDidHide(() => {
    console.log('app hide')
  })

  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <RecoilRoot>{props.children}</RecoilRoot>
  )
}
