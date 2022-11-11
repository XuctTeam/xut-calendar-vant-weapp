/*
 * @Author: Derek Xu
 * @Date: 2022-11-11 13:44:25
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-11 14:40:47
 * @FilePath: \xut-calendar-vant-weapp\src\pages\Interactionmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Container from '@/components/container'
import { useNav } from '@/utils'
import Unite from '@antmjs/unite'
import { Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import './index.less'

export default Unite(
  {
    state: {}
  },
  function ({ state, events, loading }) {
    return (
      <Container navTitle='日程参与' enablePagePullDownRefresh={false} useNav={useNav()} useMenuBtns={false} className='pages-interactionmanager-index'>
        <>
          <View className='li'>
            <View className='circle sign'>
              <Icon classPrefix='page-icon' name='qiandao' size={50} onClick={(e) => {}}></Icon>
            </View>
            <View className='title'>
              <View className='first'>签到</View>
              <View className='second'>可自定义签到，也可关联日程</View>
            </View>
          </View>
          <View className='li'>
            <View className='circle solitaire'>
              <Icon classPrefix='page-icon' name='feijifenxianglianjie' size={50} onClick={(e) => {}}></Icon>
            </View>
            <View className='title'>
              <View className='first'>接龙</View>
              <View className='second'>可自定义签到，也可关联日程</View>
            </View>
          </View>
          <View className='li'>
            <View className='circle question'>
              <Icon classPrefix='page-icon' name='question' size={50} onClick={(e) => {}}></Icon>
            </View>
            <View className='title'>
              <View className='first'>问卷</View>
              <View className='second'>可自定义签到，也可关联日程</View>
            </View>
          </View>
        </>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
