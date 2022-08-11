/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 09:46:12
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-11 18:24:08
 * @FilePath: \xut-calendar-vant-weapp\src\components\avatar\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { CSSProperties, ReactNode } from 'react'
import { Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { AvatarShape, AvatarSize } from './avatar.shared'
import { prefixClassname } from '@/styles/prefix'
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
          [prefixClassname('avatar--circle')]: shape === 'circle',
          [prefixClassname('avatar--square')]: shape === 'square'
        },
        {
          [prefixClassname('avatar--mini')]: size === 'mini',
          [prefixClassname('avatar--small')]: size === 'small',
          [prefixClassname('avatar--medium')]: size === 'medium',
          [prefixClassname('avatar--large')]: size === 'large'
        },
        className
      )}
      onClick={click}
      {...restProps}
    >
      {src ? <Image round={shape === 'circle'} src={src} /> : children}
    </View>
  )
}

export default Index
