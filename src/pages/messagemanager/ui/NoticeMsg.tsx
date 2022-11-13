/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-04-23 19:48:46
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-12 21:46:47
 */

import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Icon } from '@antmjs/vantui'

const NoticeMsg: FunctionComponent = () => {
  return (
    <View className='notice-message'>
      <Icon classPrefix='page-icon' name='ziyuan' size={80}></Icon>
      <View className='summary'>
        <View className='service'>
          <View>服务通知</View>
          <View className='time'>5月29日</View>
        </View>
        <View>订单完成</View>
      </View>
    </View>
  )
}

export default NoticeMsg
