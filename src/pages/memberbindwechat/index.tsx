/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 08:43:16
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindwechat\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, Cell, CellGroup, Empty } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useEnv, useLogin, useToast, useUserInfo } from 'taro-hooks'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useEffect } from 'react'
import { userInfoStore, userAuthInfoStore, calendarStore } from '@/calendar/store/store'
import Container from '@/components/container'
import Avatar from '@/components/avatar'
import calendar from '@/calendar'
import { IUserInfo as IMemberUserInfo, IUserAuth } from '~/../types/user'
import { IDavCalendar } from '~/../types/calendar'

import './index.less'

export default Unite(
  {
    state: {
      code: '',
      loading: false
    },

    modifyMemberNameAndAvatar() {
      calendar.$api.user
        .updateWxInfo()
        .then((res) => {
          this._success(res as any as IMemberUserInfo)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getUserInfo() {
      this.hooks['getUserProfile']({ lang: 'zh_CN', desc: '用于完善会员资料' })
        .then((res: any) => {
          const { iv, encryptedData } = res
          if (!iv || !encryptedData) {
            this.hooks['toast']({ title: '微信登陆失败' })
            return
          }
          this._bindWx(encryptedData, iv)
        })
        .catch((err: any) => {
          console.log(err)
        })
    },

    _login() {
      this.hooks['login'](true)
        .then((res: string) => {
          this.setState({
            code: res
          })
        })
        .catch((err: any) => {
          console.log(err)
          this.hooks['login'](false)
            .then((rs: string) => {
              this.setState({
                code: rs
              })
            })
            .catch((er: any) => {
              console.log(er)
              this.hooks['show']({
                title: '获取微信Code失败',
                icon: 'error'
              })
            })
        })
    },

    _bindWx(encryptedData: string, iv: string) {
      if (!this.state.code) return
      calendar.$api.user
        .bindWx(this.state.code, encryptedData, iv)
        .then(() => {
          this._back()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _success(member: IMemberUserInfo) {
      this.hooks['show']({
        title: '修改成功',
        icon: 'success'
      })
      const { id, name, avatar } = member
      this.hooks['setUserInfoState']({
        id,
        name,
        avatar
      })
      const _calendars: IDavCalendar[] = []
      this.hooks['calendars'].forEach((c: IDavCalendar) => {
        _calendars.push(c.createMemberId === id ? { ...c, name: name } : { ...c })
      })
      this.hooks['setCalendarState'](_calendars)
      window.setTimeout(() => {
        this.hooks['back']()
      }, 1500)
    },

    async _back() {
      this.hooks['toast']({
        title: '操作成功',
        icon: 'success'
      })
      const res: IUserAuth[] = await calendar.$api.user.auths()
      this.hooks['setUserAuthsState'](res)
      window.setTimeout(() => {
        this.hooks['back']()
      }, 1500)
    }
  },
  function ({ state, events }) {
    const setUserInfoState = useSetRecoilState(userInfoStore)
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const [calendars, setCalendarState] = useRecoilState(calendarStore)
    const { loading } = state
    const { modifyMemberNameAndAvatar, getUserInfo, _login } = events
    const env = useEnv()
    const { login } = useLogin()
    const [, { getUserProfile }] = useUserInfo()
    const back = calendar.$hooks.useBack({ to: 6 })
    const usedNav = calendar.$hooks.useNav()
    const { show, hide } = useToast({})

    const wxAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'open_id') : undefined

    events.setHooks({
      show: show,
      hide: hide,
      back: back,
      login: login,
      wxAuth: wxAuth,
      calendars: calendars,
      setCalendarState: setCalendarState,
      setUserInfoState: setUserInfoState,
      setUserAuthsState: setUserAuthsState,
      getUserProfile: getUserProfile
    })

    useEffect(() => {
      if (env === 'WEAPP') {
        _login()
      }
    }, [])

    return (
      <Container navTitle='微信绑定' enablePagePullDownRefresh={false} className='pages-member-bind-wechat-index' useNav={usedNav} useMenuBtns={usedNav}>
        {wxAuth ? (
          <>
            <View className='van-page-box'>
              <CellGroup inset className='van-form-cell-group'>
                <Cell title='头像' size='large' className='van-avatar-cell'>
                  <Avatar src={wxAuth?.avatar} shape='circle' size='large' />
                </Cell>
                <Cell title='昵称'>{wxAuth.nickName}</Cell>
              </CellGroup>
            </View>
            <View className='van-page-button'>
              <Button type='info' block onClick={modifyMemberNameAndAvatar}>
                使用昵称头像
              </Button>
            </View>
          </>
        ) : (
          <>
            <View className='box'>
              <Empty image='error' description='暂未绑定' />
            </View>
            <View className='van-page-button'>
              {env === 'WEAPP' && (
                <Button block color='info' disabled={loading} onClick={getUserInfo}>
                  绑定
                </Button>
              )}
            </View>
          </>
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
