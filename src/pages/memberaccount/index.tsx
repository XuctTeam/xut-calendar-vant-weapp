/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-12 18:42:57
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberaccount\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, Cell, Dialog, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import { useRecoilState, useSetRecoilState } from 'recoil'
import Avatar from '@/components/avatar'
import { userInfoStore, userAuthInfoStore, calendarStore } from '@/store'
import Images from '@/constants/images'
import Header from '@/components/header'
import { cacheRemoveSync } from '@/cache'
import { useBack } from '@/utils/taro'
import { UploadHeader } from './ui'
import { logout, updateAvatar } from '@/api/user'

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

    modiftAvatar(url: string) {
      updateAvatar(url)
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
      logout()
        .then(() => {
          cacheRemoveSync('accessToken')
          cacheRemoveSync('refreshToken')
          cacheRemoveSync('userId')
          this.hooks['setUserInfoState'](undefined)
          this.hooks['setUserAuthsState']([])
          this.hooks['setCalendarState']([])
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
    const [back] = useBack({
      to: 4
    })
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const [userInfoState, setUserInfoState] = useRecoilState(userInfoStore)
    const setCalendarState = useSetRecoilState(calendarStore)

    const { avatar, name } = userInfoState || { avatar: Images.DEFAULT_AVATAR, name: '' }
    const { headerOpen, loading } = state
    const { setHeaderOpen, modiftAvatar, to, logout } = events
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
      setCalendarState: setCalendarState
    })
    return (
      <Container
        navTitle='账号与安全'
        enablePagePullDownRefresh={false}
        className='pages-member-account-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='账号与安全' left to={4}></Header>
        }}
      >
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
          updateAvatar={modiftAvatar}
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
