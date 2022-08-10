/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-10 10:11:47
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberaccountmerge\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, Checkbox, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'
import Container from '@/components/container'
import { userInfoStore, userAuthInfoStore, calendarStore } from '@/store'
import { merge, logout } from '@/api/user'
import Header from '@/components/header'

import './index.less'
import { cacheRemoveSync } from '@/cache'

export default Unite(
  {
    state: {
      check: false,
      loading: false,
      phone: ''
    },

    async onLoad() {
      const { phone } = Router.getParams()
      if (!phone) {
        this.setState({
          phone
        })
      }
    },

    setCheck(check: boolean) {
      this.setState({
        check
      })
    },

    merge() {
      if (!this.state.check) {
        this._error('请勾选确认~')
        return
      }
      if (!this.state.phone) {
        this._error('未获取手机号参数~')
        return
      }
      this.setState({
        loading: true
      })
      merge(this.state.phone)
        .then(() => {})
        .catch((err: any) => {
          console.log(err)
        })
    },

    _success() {
      this.hooks['toast']({
        title: '合并完成，退出后重新登录',
        icon: 'success'
      })
      logout()
        .then(() => {
          this._clean()
          return
        })
        .catch((err: any) => {
          console.log(err)
          if (err.status === 401) {
            this._clean()
            return
          }
          this._error('退出失败')
        })
    },

    _clean() {
      cacheRemoveSync('accessToken')
      cacheRemoveSync('refreshToken')
      cacheRemoveSync('userId')
      this.hooks['setUserInfoState'](undefined)
      this.hooks['setUserAuthsState']([])
      this.hooks['setCalendarState']([])
      window.setTimeout(() => {
        this.hooks['back']()
      }, 1500)
    },

    _error(title: string) {
      this.hooks['toast']({
        title
      })
    }
  },
  function ({ state, events }) {
    const { check, loading } = state
    const { setCheck, merge } = events
    const [userInfo, setUserInfoState] = useRecoilState(userInfoStore)
    const setCalendarState = useSetRecoilState(calendarStore)
    const setUserAuthsState = useSetRecoilState(userAuthInfoStore)

    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 4,
      delta: 3
    })
    events.setHooks({
      toast: toast,
      back: back,
      setUserInfoState: setUserInfoState,
      setCalendarState: setCalendarState,
      setUserAuthsState: setUserAuthsState
    })
    return (
      <Container
        navTitle='账号合并'
        enablePagePullDownRefresh={false}
        className='pages-member-account-merge-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='账号合并' left to={4}></Header>
        }}
      >
        <View className='van-page-box'>
          <View className='alarm'>
            <View className='title'>亲爱的： {userInfo ? userInfo.name : ''} </View>
            <View>您的手机号登录方式将合并至当前登录账号下。合并之前，需要您确认如下信息：</View>
            <View className='alarm-item'>
              <View className='alarm-item-flex'>
                <View>1.</View>
                <View>账号合并后，原账号下所有数据将迁移至此账号。</View>
              </View>
              <View className='alarm-item-flex'>
                <View>2.</View>
                <View>账号合并后，原账号下所有数据将被清除。账号一旦被清除，数据将无法恢复。</View>
              </View>
              <View className='alarm-item-flex'>
                <View>3.</View>
                <View>账号合并时，如日历数量超过个人最大总数将无法合并。</View>
              </View>
              <View className='check'>
                <Checkbox
                  checkedColor='red'
                  shape='square'
                  value={check}
                  onChange={(e) => {
                    setCheck(e.detail)
                  }}
                >
                  我已经了解合并风险
                </Checkbox>
              </View>
            </View>
          </View>
        </View>
        <View className='van-page-button'>
          <Button block type='info' onClick={merge} disabled={loading}>
            确定
          </Button>
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
