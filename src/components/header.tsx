import { Fragment } from 'react'
import { cacheGetSync } from '@/cache'
import { useWebEnv } from '@/hooks'
import { useBack } from '@/utils/taro'
import './header.less'

import { NavBar, MiniNavBar, Toast } from '@antmjs/vantui'

interface IPageOption {
  title: string
  to: number
  left: boolean
  data?: any
  delta?: number
}

export default function Index(props: IPageOption): JSX.Element {
  const webEnv = useWebEnv()
  const wxBrower = cacheGetSync('wxBrower')
  const [back] = useBack({})

  const routerToBack = () => {
    if (!props.to) props.to = 1
    back({
      to: props.to,
      data: props.data,
      delta: props.delta,
    })
  }

  return webEnv && !wxBrower ? (
    <NavBar
      title={props.title}
      safeAreaInsetTop={false}
      leftArrow={props.left}
      leftText={props.left ? '返回' : ''}
      onClickLeft={routerToBack}
    ></NavBar>
  ) : (
    <Fragment></Fragment>
  )
}
