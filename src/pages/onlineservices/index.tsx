/*
 * @Author: Derek Xu
 * @Date: 2022-08-01 09:57:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 09:56:18
 * @FilePath: \xut-calendar-vant-weapp\src\pages\onlineservices\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, Image } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import Images from '@/calendar/constants/images'

import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {}
  },
  function ({}) {
    return (
      <Container navTitle='在线客服' enablePagePullDownRefresh={false} className='pages-online-services-index'>
        <View className='van-page-box'>
          <View className='image'>
            <Image round src={Images.DEFAULT_QR_IMAGE} />
          </View>
        </View>
        {process.env.TARO_ENV === 'weapp' && (
          <View className='van-page-button'>
            <Button type='primary' block openType='contact'>
              在线客服
            </Button>
          </View>
        )}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
