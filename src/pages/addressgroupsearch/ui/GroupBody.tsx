/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 16:56:25
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 09:06:22
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupsearch\ui\GroupBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { Button, Col, Row, Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Avatar from '@/components/avatar'

interface IPageOption {
  id?: string
  name: string
  avatar?: string
  count: number
  num: number
  hasPasword: boolean
  onJoin: (id: string, hasPasword: boolean) => void
}

const Group: FC<IPageOption> = (props) => {
  const { id, name, avatar, count, num, hasPasword } = props

  return (
    <Row className='body'>
      <Col span={17} className='left'>
        <View>{avatar ? <Avatar src={avatar}></Avatar> : <Avatar className='avatar'>G</Avatar>}</View>
        <View className='title'>
          <View className='label'>{name}</View>
          <View className='num'>
            <Icon name='friends-o'></Icon> {count} / {num}
          </View>
        </View>
      </Col>
      <Col span={7} className='button'>
        <Button type='warning' size='small' round onClick={() => props.onJoin(id || '', hasPasword)}>
          加入
        </Button>
      </Col>
    </Row>
  )
}
export default Group
