/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-29 21:37:57
 * @FilePath: \xut-calendar-vant-weapp\src\pages\login\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useEffect, useRef } from 'react'
import Router from 'tarojs-router-next'
import { View, Navigator, ITouchEvent } from '@tarojs/components'
import { Button, Checkbox, Icon, Image, CellGroup, Field } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { useSetRecoilState } from 'recoil'
import { useLogin, useUserInfo, useToast } from 'taro-hooks'
import { back } from '@/utils/taro'
import { cacheSetSync, cacheRemoveSync } from '@/cache'
import Container from '@/components/container'
import { IUserAuth, IUserInfo } from '~/../types/user'
import { IDavCalendar } from '~/../types/calendar'
import { wechatLogin, phoneLogin, usernameLogin } from '@/api/login'
import { userInfoStore, userAuthInfoStore, calendarStore } from '@/store'
import { sendSmsCode, baseUserInfo, auths } from '@/api/user'
import { list as listQueryCalendar } from '@/api/calendar'
import { checkMobile, brower } from '@/utils'
import classnames from 'classnames'
import Images from '@/constants/images'
import { create } from '@/utils/countdown'
import './index.less'

export default Unite(
  {
    state: {
      icode: { code: '', ts: 0 },
      self: false,
      phoneForm: false,
      username: '',
      password: '',
      phone: '',
      smsCode: '',
      smsText: '发送验证码',
      smsLoading: false,
      loginLoading: false
    },

    init() {
      if (process.env.TARO_ENV !== 'weapp') return
      this.hooks['login'](true)
        .then((code: any) => {
          this.setState({
            icode: { code: code, ts: dayjs().valueOf() }
          })
        })
        .catch((err: any) => {
          console.log(err)
          this.hooks['login'](false)
            .then((code: any) => {
              this.setState({
                icode: { code: code, ts: dayjs().valueOf() }
              })
            })
            .catch((err: any) => {
              this._error('获取code失败')
              console.log(err)
            })
        })
    },

    setUsername(username: string) {
      this.setState({
        username
      })
    },

    setPassword(password: string) {
      this.setState({
        password
      })
    },

    setPhone(phone: string) {
      this.setState({
        phone
      })
    },

    setSmsCode(smsCode: string) {
      this.setState({
        smsCode
      })
    },

    setPhoneForm(phoneForm: boolean) {
      this.setState({
        phoneForm
      })
    },

    setSelf(self: boolean) {
      this.setState({
        self
      })
    },

    setLoginLoading(loginLoading: boolean) {
      this.setState({
        loginLoading
      })
    },

    /**
     * 使用手机号登录
     * @param phone
     * @param smsCode
     */
    loginByPhoneOrUsername() {
      if (!this.state.self) {
        this._error('请先勾选协议')
        return
      }
      /* 电话登录 */
      if (this.state.phoneForm) {
        if (!this.state.phone) {
          this._error('手机号码不能为空')
          return
        }
        if (!checkMobile(this.state.phone)) {
          this._error('手机号码错误')
          return
        }
        if (!this.state.smsCode) {
          this._error('验证码不能为空')
          return
        }
        this._phoneLogin()
        return
      }
      if (!this.state.username) {
        this._error('账号不能为空')
        return
      }
      if (!this.state.password) {
        this._error('密码不能为空')
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
      this.setLoginLoading(true)
      return usernameLogin(this.state.username, this.state.password)
        .then((res) => {
          this._saveTokenToCache(res.access_token, res.refresh_token)
        })
        .catch((error) => {
          console.log(error)
          this.setLoginLoading(false)
        })
    },

    loginByCode() {
      if (!this.state.self) {
        this._error('请先勾选协议')
        return
      }
      if (!this.state.icode) {
        this._error('微信登录失败')
        return
      }
      if (this.state.icode.ts - dayjs().valueOf() > 1000 * 60 * 5) {
        this._error('请在规定时间内完成授权')
        return
      }
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      const code: string = this.state.icode.code

      this.hooks['getUserProfile']({ lang: 'zh_CN', desc: '用于完善会员资料' })
        .then((res: any) => {
          const { iv, encryptedData } = res
          if (!iv || !encryptedData) {
            this._error('微信登陆失败')
            return
          }
          wechatLogin(code, iv, encryptedData)
            .then((rs) => {
              this._saveTokenToCache(rs.access_token, rs.refresh_token)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err: any) => {
          this._error('授权失败')
          console.log(err)
        })
    },

    pushCode() {
      if (!checkMobile(this.state.phone)) {
        this._error('手机号错误')
        return
      }
      sendSmsCode(this.state.phone)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
          this._stopSmsCode()
        })
      this._setTextTime()
    },

    _setTextTime() {
      this.hooks['countDownRef'].current.start(0, 2, 0)
      this.setState({
        smsLoading: true
      })
    },

    async _saveTokenToCache(accessToken: string, refreshToken: string) {
      cacheSetSync('accessToken', 'Bearer ' + accessToken)
      cacheSetSync('refreshToken', 'Bearer ' + refreshToken)
      const result = await Promise.all([baseUserInfo(), auths(), listQueryCalendar()])
      if (!(result[0] && result[1]) && result[2]) {
        this._error('获取用户信息失败')
        cacheRemoveSync('accessToken')
        cacheRemoveSync('refreshToken')
        return
      }
      this.hooks['setUserInfoState'](result[0] as IUserInfo)
      this.hooks['setUserAuthState'](result[1] as IUserAuth[])
      this.hooks['setCalendarState'](result[2] as any as IDavCalendar[])
      this.hooks['show']({
        icon: 'success',
        title: '登录成功',
        duration: 1500
      })
      setTimeout(() => {
        this.setLoginLoading(false)
        back({
          to: 4
        })
      }, 2000)
    },

    setSmsText(counter: number) {
      this.setState({
        smsText: '重发(' + counter + ')'
      })
    },

    setSmsTextEnd() {
      this.setState({
        smsText: '发送验证码',
        smsLoading: false
      })
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

    _error(msg: string) {
      this.hooks['show']({
        icon: 'error',
        title: msg
      })
    }
  },
  function ({ state, events }) {
    const { self, phoneForm, username, password, phone, smsCode, smsText, smsLoading, loginLoading } = state
    const {
      init,
      setUsername,
      setPassword,
      setPhone,
      setSmsCode,
      setPhoneForm,
      setSelf,
      pushCode,
      loginByPhoneOrUsername,
      loginByCode,
      setSmsText,
      setSmsTextEnd
    } = events
    const [login] = useLogin()
    const [, { getUserProfile }] = useUserInfo()
    const [show] = useToast({
      icon: 'error'
    })
    const webEnv = brower()
    const setUserInfoState = useSetRecoilState(userInfoStore)
    const setUserAuthState = useSetRecoilState(userAuthInfoStore)
    const setCalendarState = useSetRecoilState(calendarStore)
    const countDownRef = useRef<any>()

    events.setHooks({
      login: login,
      show: show,
      countDownRef: countDownRef,
      getUserProfile: getUserProfile,
      setUserInfoState: setUserInfoState,
      setUserAuthState: setUserAuthState,
      setCalendarState: setCalendarState
    })

    useEffect(() => {
      init()
      countDownRef.current = create(
        Date.now() + 1000 * 100,
        ({ d, h, m, s }) => {
          console.log(`${d}天${h}时${m}分${s}秒`)
          setSmsText(m * 60 + s)
        },
        () => {
          setSmsTextEnd()
        }
      )
      return () => {
        countDownRef.current.clean()
      }
    }, [])

    return (
      <Container navTitle='登录' className='pages-login-index'>
        <View className='section'>
          {webEnv && (
            <View className='navigation_minibar_left_back back-btn' onClick={() => back({ to: 4, data: { isLogin: true } })}>
              <Icon name='arrow-left' />
            </View>
          )}
          <View className='right-top-sign' />
          <View className='logo'>
            <Image src={Images.DEFAULT_LOG_IMAGE} style={{ width: '140px', height: '120px' }}></Image>
          </View>
          <View
            className={classnames('login-form', {
              ['login-form_bg']: process.env.TARO_ENV !== 'weapp'
            })}
          >
            {process.env.TARO_ENV !== 'weapp' && (
              <>
                <View className='form'>
                  {!phoneForm ? (
                    <CellGroup>
                      <Field
                        label='账号'
                        titleWidth='50px'
                        placeholder='支持账号/邮箱/手机号'
                        value={username}
                        onChange={(e: ITouchEvent) => {
                          setUsername(e.detail)
                        }}
                      />
                      <Field
                        label='密码'
                        titleWidth='50px'
                        password
                        placeholder='请输入密码'
                        value={password}
                        onChange={(e: ITouchEvent) => setPassword(e.detail)}
                        renderButton={
                          <Button size='small' plain type='info' onClick={() => Router.toMemberforgetpassword()}>
                            忘记密码
                          </Button>
                        }
                      ></Field>
                    </CellGroup>
                  ) : (
                    <CellGroup>
                      <Field
                        label='手机号'
                        titleWidth='50px'
                        placeholder='请输入手机号'
                        value={phone}
                        maxlength={11}
                        type='number'
                        onChange={(e: ITouchEvent) => setPhone(e.detail)}
                      ></Field>
                      <Field
                        label='验证码'
                        titleWidth='50px'
                        placeholder='请输入验证码'
                        maxlength={4}
                        type='number'
                        value={smsCode}
                        onChange={(e: ITouchEvent) => setSmsCode(e.detail)}
                        renderButton={
                          <Button size='small' plain type='info' disabled={smsLoading} onClick={pushCode}>
                            {smsText}
                          </Button>
                        }
                      ></Field>
                    </CellGroup>
                  )}
                  <View className='btn'>
                    <View onClick={() => setPhoneForm(!phoneForm)}>{phoneForm ? '账号密码登录' : '验证码登录'}</View>
                    <View onClick={() => Router.toMemberregister()}>立即注册</View>
                  </View>
                </View>

                <Button type='danger' block onClick={loginByPhoneOrUsername} disabled={loginLoading}>
                  登录
                </Button>
              </>
            )}
          </View>
          <View className='self'>
            <Checkbox value={self} checkedColor='red' onChange={(e: any) => setSelf(e.detail)}>
              登录即已同意
              {process.env.TARO_ENV === 'weapp' ? (
                <Navigator url='/pages/privacyrule/index'>《隐私保护政策》</Navigator>
              ) : (
                <a
                  href='#!'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    Router.toPrivacyrule()
                  }}
                >
                  《隐私保护政策》
                </a>
              )}
            </Checkbox>
          </View>
        </View>
        <View className='footer'>
          {process.env.TARO_ENV === 'weapp' && (
            <View className='btn' onClick={loginByCode}>
              <Icon classPrefix='page-icon' name='weixin1' size='36px'></Icon>
              <View className='label'>微信</View>
            </View>
          )}
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
