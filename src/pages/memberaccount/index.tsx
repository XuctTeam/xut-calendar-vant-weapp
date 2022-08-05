/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-05 13:44:56
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberaccount\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Fragment } from 'react'
import { Button, Cell, Dialog, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import Avatar from '@/components/avatar'
import { IUserInfo } from '~/../@types/user'
import { userInfoStore, userAuthInfoStore } from '@/store'
import Images from '@/constants/images'
import Header from '@/components/header'
import { cacheRemoveSync } from '@/cache'
import { useBack } from '@/utils/taro'
import { UploadHeader } from './ui'
import { updateName, logout, updateAvatar } from '@/api/user'

import './index.less'

export default Unite(
  {
    state: {
      headerOpen: false
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
      logout()
        .then(() => {
          cacheRemoveSync('accessToken')
          cacheRemoveSync('refreshToken')
          cacheRemoveSync('userId')
          this.hooks['setUserInfoState'](undefined)
          this.hooks['setUserAuthsState']([])
          window.setTimeout(() => {
            this.hooks['back']()
          }, 500)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  function ({ state, events }) {
    const [back] = useBack({
      to: 4
    })
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const [userInfoState, setUserInfoState] = useRecoilState(userInfoStore)

    const { avatar, name } = userInfoState || { avatar: Images.DEFAULT_AVATAR, username: '' }
    const { headerOpen } = state
    const { setHeaderOpen, modiftAvatar, logout } = events
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
      setUserAuthsState: setUserAuthsState
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
        <View className='box'>
          <Cell title='头像' size='large'>
            <Avatar src={avatar || Images.DEFAULT_AVATAR} round size='large' onClick={() => setHeaderOpen(true)} />
          </Cell>
          <Cell title='名称' clickable onClick={() => setNameOpen(true)}>
            {name}
          </Cell>
          <Cell title='登录账号' clickable onClick={() => to(2)}>
            {userNameAuth ? userNameAuth.username : '未绑定'}
          </Cell>
          <Cell title='手机号' clickable onClick={() => to(3)}>
            {phoneAuth ? phoneAuth.username : '未绑定'}
          </Cell>
          <Cell title='邮箱' clickable onClick={() => to(5)}>
            {emailAuth ? emailAuth.username : '未绑定'}
          </Cell>
          <Cell title='微信' clickable onClick={() => to(6)}>
            {wxAuth ? wxAuth.nickName : ''}
          </Cell>
          <Cell title='设置密码' clickable onClick={() => to(4)}></Cell>
        </View>
        <View className='button'>
          <Button type='warning' block onClick={logout}>
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
