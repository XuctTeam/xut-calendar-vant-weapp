/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 11:37:34
 * @FilePath: \xut-calendar-vant-weapp\src\pages\aboutus\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/unite'
import { Router } from 'tarojs-router-next'
import { Image } from '@antmjs/vantui'
import { View, Navigator } from '@tarojs/components'
import { useWebEnv } from '@/calendar/hooks/hooks'
import Container from '@/components/container'
import calendar from '@/calendar'
import Images from '@/calendar/constants/images'
import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {},
    async loadList() {},
    getVersion() {
      return process.env.DEPLOY_VERSION
    }
  },
  function ({ events }) {
    const env = useWebEnv()
    const { getVersion } = events
    const usedNav = calendar.$hooks.useNav()

    return (
      <Container navTitle='关于我们' enablePagePullDownRefresh={false} useNav={usedNav} useMenuBtns={usedNav} className='pages-aboutus-index'>
        <View className='box'>
          <Image src={Images.DEFAULT_LOG_IMAGE} style={{ width: '100px', height: '100px' }}></Image>
          <View className='title'>楚日历</View>
          <View className='version'>{'V' + getVersion()}</View>
        </View>
        <View className='bottom'>
          {env ? (
            <a
              href='#!'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                Router.toPrivacyrule()
              }}
            >
              《隐私保护政策》
            </a>
          ) : (
            <Navigator url='/pages/privacyrule/index'>《隐私保护政策》</Navigator>
          )}
          <View className='copyright'>
            <View>Copyright@2020-2022 楚恬商行.</View>
            <View>All Rights Reserved</View>
          </View>
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
