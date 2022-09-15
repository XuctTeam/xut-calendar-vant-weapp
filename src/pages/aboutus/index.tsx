/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-15 09:32:08
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
import './index.less'
import Header from '@/components/header'

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

    return (
      <Container
        navTitle='关于我们'
        h5Nav={true}
        enablePagePullDownRefresh={false}
        className='pages-aboutus-index'
        renderPageTopHeader={() => {
          return <Header title='关于我们' left to={4}></Header>
        }}
      >
        <View className='box'>
          <Image src={Images.DEFAULT_LOG_IMAGE} style={{ width: '220px', height: '180px' }}></Image>
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
