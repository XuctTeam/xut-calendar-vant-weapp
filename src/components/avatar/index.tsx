/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 09:46:12
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-12 08:39:03
 * @FilePath: \xut-calendar-vant-weapp\src\components\avatar\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { CSSProperties, ReactNode } from 'react'
import { Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { prefixClassName } from '@/styles/prefix'
import { AvatarShape, AvatarSize } from './avatar.shared'
import './index.less'

interface IPageOption {
  className?: string
  style?: CSSProperties
  src?: string
  shape?: AvatarShape
  size?: AvatarSize
  children?: ReactNode
  onClick?: () => void
}

function Index(props: IPageOption): JSX.Element {
  const { className, src, shape = 'circle', size = 'medium', children, ...restProps } = props

  const click = () => {
    if (props.onClick && props.onClick instanceof Function) {
      props.onClick()
      return
    }
    console.log('onclick')
  }

  return (
    <View
      className={classNames(
        'van-avatar',
        {
          [prefixClassName('avatar--circle')]: shape === 'circle',
          [prefixClassName('avatar--square')]: shape === 'square'
        },
        {
          [prefixClassName('avatar--mini')]: size === 'mini',
          [prefixClassName('avatar--small')]: size === 'small',
          [prefixClassName('avatar--medium')]: size === 'medium',
          [prefixClassName('avatar--large')]: size === 'large'
        },
        className
      )}
      onClick={click}
      {...restProps}
    >
      {src ? <Image round={shape === 'circle'} src={src} style={{ width: '100%', height: '100%' }} /> : children}
    </View>
  )
}

export default Index
