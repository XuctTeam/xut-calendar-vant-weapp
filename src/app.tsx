/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:18:26
 * @FilePath: \xut-calendar-vant-weapp\src\app.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import { useDidShow, useDidHide, nextTick } from '@tarojs/taro'
import * as dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import calendar from '@/calendar'
import 'dayjs/locale/zh-cn'
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
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 对应 onShow
  useDidShow(() => {
    nextTick(() => {
      calendar.$platform.load()
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
