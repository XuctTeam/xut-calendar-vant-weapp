/*
 * @Author: Derek Xu
 * @Date: 2022-06-18 18:27:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-13 21:41:51
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\ui\GroupHeader.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Col, Row, Icon } from '@antmjs/vantui'

interface IPageOption {
  mineClick: () => void
  addGroup: () => void
}

const GroupHeader: FunctionComponent<IPageOption> = (props) => {
  return (
    <View className='group-header'>
      <Row gutter={10} className='header-opt'>
        <Col span={12}>
          <View className='box' onClick={props.addGroup}>
            <Icon classPrefix='page-icon' name='tuandui' size='36px'></Icon>
            <View className='title'>
              <View className='label'>新增群组</View>
              <View className='desc'>创建群组</View>
            </View>
          </View>
        </Col>
        <Col span={12}>
          <View className='box' onClick={props.apply}>
            <Icon classPrefix='page-icon' name='qingjiashenqing' size='36px'></Icon>
            <View className='title'>
              <View className='label'>新的申请</View>
              <View className='desc'>申请加入群组</View>
            </View>
          </View>
        </Col>
      </Row>
      <View className='br'></View>
    </View>
  )
}

export default GroupHeader
