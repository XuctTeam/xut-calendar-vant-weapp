/*
 * @Author: Derek Xu
 * @Date: 2022-08-14 11:31:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 09:27:14
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmember\ui\Member.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Avatar from '@/components/avatar'
import { Col, Row } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { FC } from 'react'

interface IPageOption {
  groupId: string
  id: string
  name: string
  avatar?: string
  selected: (groupId: string, memberId: string) => void
}

const Member: FC<IPageOption> = (props) => {
  const { groupId, id, name, avatar, selected } = props
  return (
    <View
      className='cell'
      hoverClass='cell--hover hover-class'
      hoverStayTime={70}
      onClick={() => {
        selected(groupId, id)
      }}
    >
      <Row>
        <Col span={4}>
          {props.avatar ? <Avatar size='medium' src={avatar}></Avatar> : <Avatar className='avatar'>{name ? name.substring(0, 1) : ''}</Avatar>}
        </Col>
        <Col span={20}>{name}</Col>
      </Row>
    </View>
  )
}

export default Member
