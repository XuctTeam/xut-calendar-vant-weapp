/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-10 22:17:38
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindwechat\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, Cell, Empty, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Header from '@/components/header'
import { useRecoilState } from 'recoil'
import { userAuthInfoStore } from '@/store'
import Container from '@/components/container'
import Avatar from '@/components/avatar'

import './index.less'

export default Unite(
  {
    state: {},

    modifyMemberNameAndAvatar() {},

    async onLoad() {}
  },
  function ({ events }) {
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const { modifyMemberNameAndAvatar } = events
    const wxAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'open_id') : undefined

    events.setHooks({
      setUserAuthsState: setUserAuthsState
    })

    return (
      <Container
        navTitle='微信绑定'
        enablePagePullDownRefresh={false}
        className='pages-member-bind-wechat-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='微信绑定' left to={4}></Header>
        }}
      >
        {wxAuth ? (
          <>
            <View className='van-page-box'>
              <Cell title='头像' size='large' className='van-avatar-cell'>
                <Avatar src={wxAuth?.avatar} round size='large' />
              </Cell>
              <Cell title='昵称'>{wxAuth.nickName}</Cell>
            </View>
            <View className='van-page-button'>
              <Button type='info' block onClick={modifyMemberNameAndAvatar}>
                使用昵称头像
              </Button>
            </View>
          </>
        ) : (
          <Empty image='error' description='暂未绑定' />
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
