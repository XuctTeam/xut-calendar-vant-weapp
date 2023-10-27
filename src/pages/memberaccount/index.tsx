/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-27 08:46:33
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberaccount\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, Cell, Dialog } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import { useRecoilState, useSetRecoilState } from 'recoil'
import Taro from '@tarojs/taro'
import Container from '@/components/container'
import Avatar from '@/components/avatar'
import Images from '@/calendar/constants/images'
import calendar from '@/calendar'
import { UploadHeader } from './ui'

import './index.less'

export default Unite(
  {
    state: {
      headerOpen: false,
      loading: false
    },
    async onLoad() {},

    setHeaderOpen(headerOpen: boolean) {
      this.setState({
        headerOpen
      })
    },

    modifyAvatar(url: string) {
      calendar.$api.user
        .updateAvatar(url)
        .then(() => {
          this.hooks['setUserInfoState']({ ...this.hooks['userInfo'], avatar: url })
        })
        .catch((err) => {
          console.log(err)
        })
      this.setState({
        headerOpen: false
      })
    },

    logout() {
      Dialog.confirm({
        title: '提示',
        message: '确认退出吗？',
        selector: 'vanDialog2'
      }).then((value) => {
        if (value === 'cancel') return
        this._logout()
      })
    },

    _logout() {
      this.setState({
        loading: true
      })
      calendar.$api.user
        .logout()
        .then(() => {
          calendar.$cache.cacheRemoveSync('accessToken')
          calendar.$cache.cacheRemoveSync('refreshToken')
          calendar.$cache.cacheRemoveSync('userId')
          this.hooks['setUserInfoState'](undefined)
          this.hooks['setUserAuthsState']([])
          this.hooks['setCalendarState']([])
          this.hooks['setGroupRefreshTimeStore'](0)
          this.hooks['setComponentRefreshTimeStore'](0)

          /** 广播消息 */
          Taro.eventCenter.trigger('logout')
          window.setTimeout(() => {
            this.setState({
              loading: false
            })
            this.hooks['back']()
          }, 1500)
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    to(ty: number) {
      switch (ty) {
        case 1:
          return Router.toMembermodifyname()
        case 2:
          return Router.toMemberbindusername()
        case 3:
          return Router.toMemberbindphone()
        case 4:
          return Router.toMembermodifypassword()
        case 5:
          return Router.toMemberbindemail()
        case 6:
          return Router.toMemberbindwechat()

        default:
          return Router.toMemberuserinfo()
      }
    }
  },
  function ({ state, events }) {
    const [back] = calendar.$hooks.useBack({ to: 4 })
    const usedNav = calendar.$hooks.useNav()
    const [userAuths, setUserAuthsState] = useRecoilState(calendar.$store.userAuthInfoStore)
    const [userInfoState, setUserInfoState] = useRecoilState(calendar.$store.userInfoStore)
    const setCalendarState = useSetRecoilState(calendar.$store.calendarStore)
    const setGroupRefreshTimeStore = useSetRecoilState(calendar.$store.groupRefreshTimeStore)
    const setComponentRefreshTimeStore = useSetRecoilState(calendar.$store.componentRefreshTimeStore)

    const { avatar, name } = userInfoState || { avatar: Images.DEFAULT_AVATAR, name: '' }
    const { headerOpen, loading } = state
    const { setHeaderOpen, modifyAvatar: modifyAvatar, to, logout } = events
    const phoneAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'phone')
        : {
            memberId: (userInfoState && userInfoState.id) || '',
            username: '',
            nickName: '',
            avatar: '',
            identityType: 'phone'
          }

    const wxAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'open_id')
        : {
            memberId: (userInfoState && userInfoState.id) || '',
            username: '',
            nickName: '',
            avatar: '',
            identityType: 'open_id'
          }
    const userNameAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'user_name')
        : {
            memberId: (userInfoState && userInfoState.id) || '',
            username: '',
            nickName: '',
            avatar: '',
            identityType: 'user_name'
          }
    const emailAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'email')
        : {
            memberId: (userInfoState && userInfoState.id) || '',
            username: '',
            nickName: '',
            avatar: '',
            identityType: 'email'
          }

    events.setHooks({
      back: back,
      userInfo: userInfoState,
      setUserInfoState: setUserInfoState,
      setUserAuthsState: setUserAuthsState,
      setCalendarState: setCalendarState,
      setGroupRefreshTimeStore: setGroupRefreshTimeStore,
      setComponentRefreshTimeStore: setComponentRefreshTimeStore
    })
    return (
      <Container navTitle='账号与安全' enablePagePullDownRefresh={false} className='pages-member-account-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='van-page-box'>
          <Cell title='头像' size='large'>
            <Avatar src={avatar || Images.DEFAULT_AVATAR} shape='circle' size='large' onClick={() => setHeaderOpen(true)} />
          </Cell>
          <Cell title='名称' clickable onClick={() => to(1)}>
            {name}
          </Cell>
          <Cell title='登录账号' clickable titleWidth='100px' onClick={() => to(2)}>
            {userNameAuth ? userNameAuth.username : '未绑定'}
          </Cell>
          <Cell title='微信' clickable onClick={() => to(6)}>
            {wxAuth ? wxAuth.nickName : '未绑定'}
          </Cell>
          <Cell title='手机号' clickable onClick={() => to(3)}>
            {phoneAuth ? phoneAuth.username : '未绑定'}
          </Cell>
          <Cell title='邮箱' titleWidth='80px' clickable onClick={() => to(5)}>
            {emailAuth ? emailAuth.username : '未绑定'}
          </Cell>
          <Cell title='设置密码' clickable onClick={() => to(4)}></Cell>
        </View>
        <View className='van-page-button'>
          <Button type='warning' block disabled={loading} onClick={logout}>
            退出登录
          </Button>
        </View>
        <Dialog id='vanDialog2' />
        <UploadHeader
          open={headerOpen}
          close={() => setHeaderOpen(false)}
          updateAvatar={modifyAvatar}
          avatar={userInfoState && userInfoState.avatar ? userInfoState.avatar : Images.DEFAULT_AVATAR}
        ></UploadHeader>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
