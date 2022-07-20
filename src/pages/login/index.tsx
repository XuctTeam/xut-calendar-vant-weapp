/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 13:53:15
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-20 17:40:39
 * @FilePath: \xut-calendar-vant-weapp\src\pages\login\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View, Navigator } from '@tarojs/components'
import Router from 'tarojs-router-next'
import { useReachBottom } from '@tarojs/taro'
import { Button, Checkbox, Icon, Unite, Image, CellGroup, Field, Toast } from '@antmjs/vantui'
import Container from '@/components/container'
import { back } from '@/utils/taro'
import { useRecoilState } from 'recoil'
import { useEnv, useLogin, useUserInfo } from 'taro-hooks'
import { IUserInfo } from 'taro-hooks/dist/useUserInfo'
import { cacheSetSync } from '@/cache'
import Images from '@/constants/images'
import { wechatLogin, phoneLogin, usernameLogin } from '@/api/login'
import { sendSmsCode, userInfo } from '@/api/user'

import './index.less'

import dayjs from 'dayjs'
import { checkMobile } from '@/utils'
import { useRef } from 'react'

interface ICode {
  code: string
  ts: number
}

const smsBtnLoadingTime: number = 120

export default Unite(
  {
    state: {
      icode: undefined,
      phoneForm: false,
      self: false,
      username: '',
      password: '',
      phone: '',
      smsCode: '',
      smsText: '发送短信',
      smsLoading: false
    },

    async onLoad() {
      if (this.hooks['env'] === 'WEAPP') {
        this.handleLogin()
      }
    },

    onUnload() {
      if (this.hooks['timerRef'].current > 0) {
        this._stopSmsCode()
      }
    },

    setIcode(val: ICode) {
      this.setState({
        icode: val
      })
    },

    setPhoneForm(val: boolean) {
      this.setState({
        phoneForm: val
      })
    },

    setUsername(val: string) {
      this.setState({
        username: val
      })
    },

    setPassword(val: string) {
      this.setState({
        password: val
      })
    },

    setPhone(val: string) {
      this.setState({
        phone: val
      })
    },

    setSmsCode(val: string) {
      this.setState({
        smsCode: val
      })
    },

    setSelf(val: boolean) {
      this.setState({
        self: val
      })
    },

    handleLogin() {
      this.hooks['login'](true)
        .then((code: string) => this.setIcode({ code: code, ts: dayjs().valueOf() }))
        .catch(() => {
          this.hooks['login'](false)
            .then((code: string) => {
              this.setIcode({ code: code, ts: dayjs().valueOf() })
            })
            .catch((err: any) => {
              Toast.fail({
                message: '失败文案'
              })
              console.log(err)
            })
        })
    },

    /**
     * 微信授权登录
     * @param res
     * @returns
     */
    async loginByCode() {
      if (!self) {
        Toast.fail({ message: '请先勾选协议' })
        return
      }
      if (!this.state.icode) {
        Toast.fail({ message: '微信登录失败' })
        return
      }
      if (this.state.icode.ts - dayjs().valueOf() > 1000 * 60 * 5) {
        Toast.fail({ message: '请在规定时间内完成授权' })
        return
      }
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      const code: string = this.state.icode.code

      this.hooks['getUserProfile']({ lang: 'zh_CN', desc: '用于完善会员资料' })
        .then((res: IUserInfo) => {
          const { iv, encryptedData } = res
          if (!iv || !encryptedData) {
            Toast.fail({ message: '微信登陆失败' })
            return
          }
          wechatLogin(code, iv, encryptedData)
            .then((rs) => {
              this._saveTokenToCache(rs.access_token, rs.refresh_token)
            })
            .catch((err: any) => {
              console.log(err)
            })
        })
        .catch((err: any) => {
          Toast.fail({ message: '授权失败' })
          console.log(err)
        })
    },

    /**
     * 使用手机号登录
     * @param phone
     * @param smsCode
     */
    async loginByPhoneOrUsername() {
      if (!this.state.self) {
        Toast.fail({ message: '请先勾选协议' })
        return
      }
      /* 电话登录 */
      if (this.state.phoneForm) {
        if (!this.state.phone) {
          Toast.fail({ message: '手机号码不能为空' })
          return
        }
        if (!this.state.smsCode) {
          Toast.fail({ message: '验证码不能为空' })
          return
        }
        this._phoneLogin()
        return
      }
      if (!this.state.username) {
        Toast.fail({ message: '账号不能为空' })
        return
      }
      if (!this.state.password) {
        Toast.fail({ message: '验证码不能为空' })
        return
      }
      this._usernameLogin()
    },

    _phoneLogin() {
      return phoneLogin(this.state.phone, this.state.smsCode)
        .then((res) => {
          this._saveTokenToCache(res.access_token, res.refresh_token)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    _usernameLogin() {
      return usernameLogin(this.state.username, this.state.password)
        .then((res) => {
          this._saveTokenToCache(res.access_token, res.refresh_token)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    _saveTokenToCache(accessToken: string, refreshToken: string) {
      cacheSetSync('accessToken', 'Bearer ' + accessToken)
      cacheSetSync('refreshToken', 'Bearer ' + refreshToken)
    },

    /**
     * 发送短信验证码
     */
    pushCode() {
      if (!checkMobile(this.state.phone)) {
        Toast.fail({ message: '手机号错误' })
        return
      }
      this._startSmsCode()
      sendSmsCode(this.state.phone)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
          this._stopSmsCode()
        })
    },

    _startSmsCode() {
      this.setState({
        smsLoading: true
      })
      this._setTimeOut(smsBtnLoadingTime - 1)
    },

    _stopSmsCode() {
      this.setState({
        smsText: '发送短信',
        smsLoading: false
      })
      if (this.hooks['timerRef'].current > 0) {
        window.clearTimeout(this.hooks['timerRef'].current)
        this.hooks['timerRef'].current = 0
      }
    },

    _setTimeOut(sec: number) {
      if (sec === 0) {
        this._stopSmsCode()
        return
      }
      this.setState({
        smsText: '重发(' + sec + ')'
      })
      this.hooks['timerRef'].current = window.setTimeout(() => {
        this._setTimeOut(sec - 1)
      }, 1000)
    }
  },
  function ({ state, events }) {
    const { phoneForm, username, password, phone, smsCode, smsText, smsLoading } = state
    const { setPhoneForm, setUsername, setPassword, setPhone, setSmsCode, setSelf, loginByPhoneOrUsername, pushCode, loginByCode } = events
    const env = useEnv()
    const timerRef = useRef<number>(0)
    const [login] = useLogin()
    const [, { getUserProfile }] = useUserInfo()

    events.setHooks({
      env: env,
      timerRef: timerRef,
      login: login,
      getUserProfile: getUserProfile
    })
    useReachBottom(() => {})
    return (
      <Container enablePagePullDownRefresh={false} className='pages-login-index'>
        <View className='section'>
          {env !== 'WEAPP' && <Icon name='arrow-left' onClick={() => back({ to: 4, data: { isLogin: true } })}></Icon>}
          <View className='right-top-sign' />
          <View className='vi-login-wrapper_logo'>
            <Image src={Images.DEFAULT_LOG_IMAGE} style={{ width: '140px', height: '120px' }}></Image>
          </View>
          <View className='vi-login-wrapper_form'>
            <View className='form'>
              {!phoneForm ? (
                <CellGroup>
                  <Field label='账号' placeholder='支持账号/邮箱/手机号' value={username} onChange={(e: any) => setUsername(e.detail.value)} />
                  <Field
                    label='密码'
                    password
                    placeholder='请输入密码'
                    value={password}
                    onChange={(e: any) => setPassword(e.detail.value)}
                    renderButton={
                      <Button size='small' color='primary'>
                        忘记密码
                      </Button>
                    }
                  ></Field>
                </CellGroup>
              ) : (
                <CellGroup>
                  <Field
                    label='手机号'
                    placeholder='请输入手机号'
                    value={phone}
                    maxlength={11}
                    type='number'
                    onChange={(e: any) => setPhone(e.detail.value)}
                  ></Field>
                  <Field
                    label='验证码'
                    placeholder='请输入验证码'
                    maxlength={4}
                    type='number'
                    value={smsCode}
                    onChange={(e: any) => setSmsCode(e.detail.value)}
                    renderButton={
                      <Button size='small' color='primary' disabled={smsLoading} onClick={pushCode}>
                        {smsText}
                      </Button>
                    }
                  ></Field>
                </CellGroup>
              )}
              <View className='btn'>
                <View onClick={() => setPhoneForm(!phoneForm)}>{phoneForm ? '账号密码登录' : '验证码登录'}</View>
                <View>立即注册</View>
              </View>
            </View>

            <Button color='danger' block onClick={loginByPhoneOrUsername}>
              登录
            </Button>
          </View>
          <View className='vi-login-wrapper_self'>
            <Checkbox className='custom-color' onChange={(e: any) => setSelf(e)}>
              登录即已同意
              {env === 'WEAPP' ? (
                <Navigator url='/pages/selfprivacy/index'>《隐私保护政策》</Navigator>
              ) : (
                <a
                  href='#!'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  《隐私保护政策》
                </a>
              )}
            </Checkbox>
          </View>
        </View>
        <View className='footer'>
          {env === 'WEAPP' && (
            <View className='btn' onClick={loginByCode}>
              <Image src={Images.DEFAULT_WECHAT_IMAGE} style={{ width: '36px', height: '36px' }} fit='heightFix' />
              <View className='label'>微信</View>
            </View>
          )}
        </View>
      </Container>
    )
  },
  { page: false }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
