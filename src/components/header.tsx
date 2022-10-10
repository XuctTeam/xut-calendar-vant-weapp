/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 18:15:14
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-10 11:50:10
 * @FilePath: \xut-calendar-vant-weapp\src\components\header.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useBack } from '@/utils/taro'
import { NavBar } from '@antmjs/vantui'
import { useNav } from '@/utils'
import './header.less'

interface IPageOption {
  title: string
  to: number
  left: boolean
  data?: any
  delta?: number
}

export default function Index(props: IPageOption): JSX.Element {
  const [back] = useBack()
  const _brower = useNav()

  const routerToBack = () => {
    if (!props.to) props.to = 1
    back({
      to: props.to,
      data: props.data,
      delta: props.delta
    })
  }

  return _brower ? (
    <NavBar title={props.title} safeAreaInsetTop={false} leftArrow={props.left} leftText={props.left ? '返回' : ''} onClickLeft={routerToBack}></NavBar>
  ) : (
    <></>
  )
}
