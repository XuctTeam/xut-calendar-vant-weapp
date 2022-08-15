/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 11:03:42
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 22:59:50
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\ui\MemberBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import Avatar from '@/components/avatar'
import { Cell, Col, Row } from '@antmjs/vantui'
import { View } from '@tarojs/components'

interface IPageOption {
  avatar: string
  groupName: string
  name: string
  time: string
  desc: string
}

const MemberBody: FC<IPageOption> = (props) => {
  const { avatar, groupName, name, time } = props
  return (
    <Row className='cell'>
      <Col span={4}>{avatar ? <Avatar src={avatar}></Avatar> : <Avatar>M</Avatar>}</Col>
      <Col span={20}>
        <View className='label'>{groupName}</View>
        <View className='name'>
          <View>{name}</View>
          <View>{time}</View>
        </View>
      </Col>
    </Row>
  )
}

export default MemberBody
