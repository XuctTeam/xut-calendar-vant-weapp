/*
 * @Author: Derek Xu
 * @Date: 2022-11-11 16:03:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 16:50:11
 * @FilePath: \xut-calendar-vant-weapp\src\components\expanse\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react'
import { Divider } from '@antmjs/vantui'
import classnames from 'classnames'
import './index.less'

interface IPageOption {
  animationShowHeight: number
  children?: ReactNode
}

const Expanse: FunctionComponent<IPageOption> = (props) => {
  const { animationShowHeight } = props
  const [animationData, setAnimationData] = useState<any>({})

  const [show, setShow] = useState<boolean>(false)
  const ref = useRef<any>()

  useEffect(() => {
    var _animation = Taro.createAnimation({
      transformOrigin: '50% 50%',
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    })
    ref.current = _animation
  }, [])

  const toggle = () => {
    if (show) {
      _up()
      return
    }
    _down()
  }

  // 下来
  const _down = () => {
    ref.current.height(animationShowHeight).step()
    setAnimationData(ref.current.export())
    setShow(true)
  }
  // 上去
  const _up = () => {
    ref.current.height(70).step()
    setAnimationData(ref.current.export())
    setShow(false)
  }

  return (
    <>
      <View style={{ overflow: 'hidden', height: '70px' }} animation={animationData}>
        {props.children}
      </View>
      <Divider
        contentPosition='center'
        style='fontSize: 18px;'
        onClick={(e) => {
          e.preventDefault()
          toggle()
        }}
      >
        <View className={classnames('expanse-click-icon', { ['expanse-fold']: show, ['expanse-unfold']: !show })}></View>
      </Divider>
    </>
  )
}

export default Expanse
