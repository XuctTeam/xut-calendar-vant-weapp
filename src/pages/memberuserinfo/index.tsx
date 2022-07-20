/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 09:26:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-20 13:49:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberuserinfo\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Container from '@/components/container'
import { cacheGetSync } from '@/cache'
import Images from '@/constants/images'
import { User, Menu } from './ui'
import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {}
  },
  function ({}) {
    const accessToken = cacheGetSync('accessToken')
    const userInfo = cacheGetSync('userInfo')

    useReachBottom(() => {})
    return (
      <Container navTitle='下拉上滑列表页面' enablePagePullDownRefresh={false} className='pages-member-info-index'>
        <User
          hasLogin={!!accessToken}
          nickname={userInfo ? userInfo.name : ''}
          avatar={userInfo && userInfo.avatar ? userInfo.avatar : Images.DEFAULT_AVATAR}
        ></User>
        <Menu accessToken={accessToken || ''}></Menu>
      </Container>
    )
  },
  { page: false }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
