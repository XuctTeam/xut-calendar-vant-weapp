/*
 * @Author: Derek Xu
 * @Date: 2022-06-18 18:27:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-11 18:59:38
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\ui\GroupHeader.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View, Image } from '@tarojs/components'
import Images from '@/constants/images'
import { Col, Row } from '@antmjs/vantui'

interface IPageOption {
  mineClick: () => void
  addGroup: () => void
}

const GroupHeader: FunctionComponent<IPageOption> = (props) => {
  return (
    <Row className='group-header' gutter={10}>
      <Col span={12}>
        <View className='box' onClick={props.addGroup}>
          <Image style={{ width: '40px', height: '40px' }} src={Images.DEFAULT_GROUP} />
          <View className='title'>
            <View className='label'>新增群组</View>
            <View className='desc'>创建群组</View>
          </View>
        </View>
      </Col>
      <Col span={12}>
        <View className='box' onClick={props.apply}>
          <Image style={{ width: '40px', height: '40px' }} src={Images.DEFAULT_GROUP_APPLY} />
          <View className='title'>
            <View className='label'>新的申请</View>
            <View className='desc'>申请加入群组</View>
          </View>
        </View>
      </Col>
    </Row>
  )
}

export default GroupHeader
