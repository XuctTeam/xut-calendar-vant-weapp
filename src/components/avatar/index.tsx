/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 09:46:12
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-20 13:15:35
 * @FilePath: \xut-calendar-vant-weapp\src\components\avatar\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { CSSProperties, ReactNode } from 'react'
import { Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { AvatarSize } from './index.shared'
import { prefixClassname } from '@/styles/prefix'
import './index.less'

interface IPageOption {
  className?: string
  style?: CSSProperties
  src?: string
  round?: boolean
  size?: AvatarSize
  children?: ReactNode
}

function Index(props: IPageOption): JSX.Element {
  const { className, src, round = false, size = 'medium', children, ...restProps } = props

  return (
    <View
      className={classNames(
        'van-avatar',
        {
          [prefixClassname('avatar--mini')]: size === 'mini',
          [prefixClassname('avatar--small')]: size === 'small',
          [prefixClassname('avatar--medium')]: size === 'medium',
          [prefixClassname('avatar--large')]: size === 'large'
        },

        className
      )}
    >
      {src ? <Image round={round} src={src} /> : children}
    </View>
  )
}

export default Index
