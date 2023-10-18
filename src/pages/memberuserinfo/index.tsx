/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 09:17:58
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 09:22:37
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberuserinfo\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useReachBottom } from '@tarojs/taro'
import { useRecoilValue } from 'recoil'
import Router from 'tarojs-router-next'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import { cacheGetSync } from '@/calendar/cache/cache'
import Images from '@/calendar/constants/images'
import { userInfoStore } from '@/calendar/store/store'
import { IUserInfo } from '~/../types/user'
import { User, Menu } from './ui'
import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {}
  },
  function ({}) {
    const accessToken = cacheGetSync('accessToken')
    const userInfo: IUserInfo | undefined = useRecoilValue(userInfoStore)

    useReachBottom(() => {})
    return (
      <Container navTitle='个人信息' enablePagePullDownRefresh={false} className='pages-member-info-index' useNav={false} useMenuBtns={false}>
        <View className='head'></View>
        <User
          hasLogin={!!accessToken}
          nickname={userInfo ? userInfo.name : ''}
          avatar={userInfo && userInfo.avatar ? userInfo.avatar : Images.DEFAULT_AVATAR}
          to={() => {
            Router.toLogin()
          }}
        ></User>
        <Menu accessToken={accessToken || ''}></Menu>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
