/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 16:46:34
 * @FilePath: \xut-calendar-vant-weapp\src\pages\aboutus\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Router from 'tarojs-router-next'
import { useWebEnv } from '@/hooks'
import { Image } from '@antmjs/vantui'
import { View, Navigator } from '@tarojs/components'
import Container from '@/components/container'
import Images from '@/constants/images'
import { useNav } from '@/utils'
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
    const _useNav = useNav()

    return (
      <Container navTitle='关于我们' enablePagePullDownRefresh={false} useNav={_useNav} useMenuBtns={_useNav} className='pages-aboutus-index'>
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
