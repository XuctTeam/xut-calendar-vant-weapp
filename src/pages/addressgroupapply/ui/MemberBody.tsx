/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 11:03:42
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 11:47:07
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\ui\MemberBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import Avatar from '@/components/avatar'
import { Col, Row, Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'

interface IPageOption {
  id: string
  active: number
  avatar: string
  groupName: string
  name: string
  time: string
  desc: string
  agreeJoin: (gmid: string) => void
  refuseJoin: (gmid: string) => void
  deleteApply: (gmid: string) => void
}

const MemberBody: FC<IPageOption> = (props) => {
  const { id, active, avatar, groupName, name, time, agreeJoin, refuseJoin, deleteApply } = props
  return (
    <View className='cell'>
      <Row className='row'>
        <Col span={4}>{avatar ? <Avatar src={avatar}></Avatar> : <Avatar className='avatar'>M</Avatar>}</Col>
        <Col span={20}>
          <View className='label'>{groupName}</View>
          <View className='name'>
            <View>{name}</View>
            <View>{time}</View>
          </View>
        </Col>
      </Row>
      <View className='br'></View>
      <View className='btn'>
        {active === 0 ? (
          <Row gutter={10}>
            <Col span={12}>
              <Icon classPrefix='page-icon' name='chenggong' size='28px' onClick={() => agreeJoin(id)}></Icon>
            </Col>
            <Col span={12}>
              <Icon classPrefix='page-icon' name='shibai' size='28px' onClick={() => refuseJoin(id)}></Icon>
            </Col>
          </Row>
        ) : (
          <Icon classPrefix='page-icon' name='shanchu' size='28px' onClick={() => deleteApply(id)}></Icon>
        )}
      </View>
    </View>
  )
}

export default MemberBody
