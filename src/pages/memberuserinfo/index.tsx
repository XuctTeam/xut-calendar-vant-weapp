/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 09:26:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-11 10:52:34
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberuserinfo\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useReachBottom } from '@tarojs/taro'
import { useRecoilValue } from 'recoil'
import Container from '@/components/container'
import { cacheGetSync } from '@/cache'
import Images from '@/constants/images'
import { userInfoStore } from '@/store'
import { IUserInfo } from '~/../types/user'
import { User, Menu } from './ui'
import './index.less'
import Router from 'tarojs-router-next'

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
