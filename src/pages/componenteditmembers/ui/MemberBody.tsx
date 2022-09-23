/*
 * @Author: Derek Xu
 * @Date: 2022-08-19 20:50:47
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-23 09:03:39
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmembers\ui\MemberBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { Cell, Checkbox } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Avatar from '@/components/avatar'

interface IPageOption {
  name: string
  avatar: string
  memberId: string
}

const MemberBody: FC<IPageOption> = (props) => {
  const { name, avatar, memberId } = props
  return (
    <Cell>
      <View className='member'>
        <View className='avatar'>
          {avatar ? <Avatar src={avatar} size='small'></Avatar> : <Avatar size='small'>{name ? props.name.substring(0, 1) : ''}</Avatar>}
          <View className='name'>{name}</View>
        </View>
        <Checkbox name={memberId} shape='square'></Checkbox>
      </View>
    </Cell>
  )
}

export default MemberBody
