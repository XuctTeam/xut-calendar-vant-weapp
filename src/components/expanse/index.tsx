/*
 * @Author: Derek Xu
 * @Date: 2022-11-11 16:03:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-16 17:28:50
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
  show: boolean
  changeShow?: (val: boolean) => void
  children?: ReactNode
}

const Expanse: FunctionComponent<IPageOption> = ({ animationShowHeight, show, changeShow, children }) => {
  const [animationData, setAnimationData] = useState<any>({})

  const ref = useRef<any>()

  useEffect(() => {
    const _animation = Taro.createAnimation({
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
    changeShow && changeShow(true)
  }
  // 上去
  const _up = () => {
    ref.current.height(70).step()
    setAnimationData(ref.current.export())
    changeShow && changeShow(false)
  }

  return (
    <>
      <View style={{ overflow: 'hidden', height: '70px' }} animation={animationData}>
        {children}
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
