import { View } from '@tarojs/components'
import { ReactNode } from 'react'
import { Position } from './index.shared'
import classNames from 'classnames'
import { prefixClassname } from '@/styles/prefix'
import './index.less'

/*
 * @Author: Derek Xu
 * @Date: 2022-07-28 17:06:19
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-29 15:49:24
 * @FilePath: \xut-calendar-vant-weapp\src\components\fixedview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
interface IPageOption {
  className?: string
  position: Position
  children: ReactNode
}

export default function Index(props: IPageOption) {
  const { className, position } = props
  return (
    <View
      className={classNames(
        'van-fixed-view',
        {
          [prefixClassname('fixed-view--bottom')]: position === 'bottom',
          [prefixClassname('fixed-view--top')]: position === 'top'
        },
        className
      )}
    >
      {props.children}
    </View>
  )
}
