/*
 * @Author: Derek Xu
 * @Date: 2022-08-19 20:50:47
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-06 10:02:35
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentattend\ui\MemberBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { Cell } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Avatar from '@/components/avatar'

interface IPageOption {
  name: string
  avatar: string
  memberId: string
}

const MemberBody: FC<IPageOption> = (props) => {
  const { name, avatar } = props
  return (
    <Cell className='member'>
      <View className='avatar'>
        {avatar ? <Avatar src={avatar} size='small'></Avatar> : <Avatar size='small'>{name ? props.name.substring(0, 1) : ''}</Avatar>}
        <View className='name'>{name}</View>
      </View>
    </Cell>
  )
}

export default MemberBody
