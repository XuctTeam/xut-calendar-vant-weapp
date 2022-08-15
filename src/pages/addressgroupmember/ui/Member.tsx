/*
 * @Author: Derek Xu
 * @Date: 2022-08-14 11:31:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 11:01:08
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmember\ui\Member.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Avatar from '@/components/avatar'
import { Col, Row } from '@antmjs/vantui'
import { FC } from 'react'

interface IPageOption {
  name: string
  avatar?: string
}

const Member: FC<IPageOption> = (props) => {
  return (
    <Row className='cell'>
      <Col span={4}>
        {props.avatar ? <Avatar size='medium' src={props.avatar}></Avatar> : <Avatar className='avatar'>{props.name ? props.name.substring(0, 1) : ''}</Avatar>}
      </Col>
      <Col span={20}>{props.name}</Col>
    </Row>
  )
}

export default Member
