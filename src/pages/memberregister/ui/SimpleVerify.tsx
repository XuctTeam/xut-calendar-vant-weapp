/*
 * @Author: Derek Xu
 * @Date: 2022-05-19 09:54:48
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-05 17:24:43
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\SimpleVerify.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FunctionComponent, useEffect, useState } from 'react'
import { WechatSimpleVerify, WebappSimpleVerify } from '@/components/simpleverify'
import { useSystemInfo } from 'taro-hooks'
import { useWebEnv } from '@/hooks'
import { useRef } from 'react'

interface IPageOption {
  success: () => void
}

const SimpleVerify: FunctionComponent<IPageOption> = (props) => {
  const webEnv = useWebEnv()
  const [width, setWidth] = useState<number>(0)
  const systemInfo = useSystemInfo() || {}
  const ref = useRef<any>()

  useEffect(() => {
    if (systemInfo.windowWidth) {
      setWidth(systemInfo.screenWidth - 70)
    }
  }, [systemInfo])

  const succ = () => {
    setTimeout(() => {
      ref.current.reset()
      props.success()
    }, 500)
  }

  return width !== 0 ? (
    webEnv ? (
      <WebappSimpleVerify ref={ref} width={width} success={succ}></WebappSimpleVerify>
    ) : (
      <WechatSimpleVerify ref={ref} width={width} success={succ}></WechatSimpleVerify>
    )
  ) : (
    <></>
  )
}

export default SimpleVerify
