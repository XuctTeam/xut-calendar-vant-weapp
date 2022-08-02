/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 13:53:15
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-01 18:49:47
 * @FilePath: \xut-calendar-vant-weapp\src\pages\login\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Navigator, ITouchEvent } from '@tarojs/components'
import { Button, Checkbox, Icon, Image, CellGroup, Field } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { useRecoilState } from 'recoil'
import { useEnv, useLogin, useUserInfo, useToast } from 'taro-hooks'
import { back } from '@/utils/taro'
import { IUserInfo as IMemberInfo } from 'taro-hooks/dist/useUserInfo'
import { cacheSetSync } from '@/cache'
import Container from '@/components/container'
import { wechatLogin, phoneLogin, usernameLogin } from '@/api/login'
import { userForceUpdateState, userAuthForceUpdateState, calendarForceUpdateState } from '@/store'
import { sendSmsCode } from '@/api/user'
import { checkMobile } from '@/utils'
import Images from '@/constants/images'
import './index.less'
import Router from 'tarojs-router-next'

interface ICode {
  code: string
  ts: number
}

export default function Index() {
  const smsBtnLoadingTime: number = 120
  const [icode, setIcode] = useState<ICode | null>(null)
  const env = useEnv()
  const [login] = useLogin()
  const [, { getUserProfile }] = useUserInfo()
  const [self, setSelf] = useState<boolean>(false)
  const [phoneForm, setPhoneForm] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [smsCode, setSmsCode] = useState<string>('')
  const [smsText, setSmsText] = useState<string>('发送短信')
  const [smsLoading, setSmsLoading] = useState<boolean>(false)
  const timerRef = useRef<number>(0)
  const [, setCalendarForceUpdateState] = useRecoilState(calendarForceUpdateState)
  const [, setUserForceUpdateState] = useRecoilState(userForceUpdateState)
  const [, setUserAuthForceUpdateState] = useRecoilState(userAuthForceUpdateState)
  const [show] = useToast({
    icon: 'error'
  })

  useEffect(() => {
    if (env === 'WEAPP') {
      handleLogin()
    }
    return () => {
      if (timerRef.current > 0) {
        _stopSmsCode()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env])

  const handleLogin = useCallback(() => {
    login(true)
      .then((code: any) => setIcode({ code: code, ts: dayjs().valueOf() }))
      .catch(() => {
        login(false)
          .then((code: any) => {
            setIcode({ code: code, ts: dayjs().valueOf() })
          })
          .catch((err) => {
            _error('获取code失败')
            console.log(err)
          })
      })
  }, [login])

  /**
   * 发送短信验证码
   */
  const pushCode = () => {
    if (!checkMobile(phone)) {
      _error('手机号错误')
      return
    }
    _startSmsCode()
    sendSmsCode(phone)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
        _stopSmsCode()
      })
  }

  /**
   * 微信授权登录
   * @param res
   * @returns
   */
  const loginByCode = async () => {
    if (!self) {
      _error('请先勾选协议')
      return
    }
    if (!icode) {
      _error('微信登录失败')
      return
    }
    if (icode.ts - dayjs().valueOf() > 1000 * 60 * 5) {
      _error('请在规定时间内完成授权')
      return
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    const code: string = icode.code

    getUserProfile({ lang: 'zh_CN', desc: '用于完善会员资料' })
      .then((res) => {
        const { iv, encryptedData } = res as any as IMemberInfo
        if (!iv || !encryptedData) {
          _error('微信登陆失败')
          return
        }
        wechatLogin(code, iv, encryptedData)
          .then((rs) => {
            _saveTokenToCache(rs.access_token, rs.refresh_token)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        _error('授权失败')
        console.log(err)
      })
  }

  /**
   * 使用手机号登录
   * @param phone
   * @param smsCode
   */
  const loginByPhoneOrUsername = async () => {
    if (!self) {
      _error('请先勾选协议')
      return
    }
    /* 电话登录 */
    if (phoneForm) {
      if (!phone) {
        _error('手机号码不能为空')
        return
      }
      if (!smsCode) {
        _error('验证码不能为空')
        return
      }
      _phoneLogin()
      return
    }
    if (!username) {
      _error('账号不能为空')
      return
    }
    if (!password) {
      _error('密码不能为空')
      return
    }
    _usernameLogin()
  }

  const _phoneLogin = () => {
    return phoneLogin(phone, smsCode)
      .then((res) => {
        _saveTokenToCache(res.access_token, res.refresh_token)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const _usernameLogin = () => {
    return usernameLogin(username, password)
      .then((res) => {
        _saveTokenToCache(res.access_token, res.refresh_token)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const _saveTokenToCache = (accessToken: string, refreshToken: string) => {
    const random = Math.random()
    cacheSetSync('accessToken', 'Bearer ' + accessToken)
    cacheSetSync('refreshToken', 'Bearer ' + refreshToken)
    setUserForceUpdateState(random)
    setUserAuthForceUpdateState(random)
    setCalendarForceUpdateState(random)
    setTimeout(() => {
      back({
        to: 4
      })
    }, 500)
  }

  const _startSmsCode = () => {
    setSmsLoading(true)
    _setTimeOut(smsBtnLoadingTime - 1)
  }

  const _stopSmsCode = () => {
    setSmsText('发送短信')
    setSmsLoading(false)
    if (timerRef.current > 0) {
      window.clearTimeout(timerRef.current)
      timerRef.current = 0
    }
  }

  const _setTimeOut = (sec: number) => {
    if (sec === 0) {
      _stopSmsCode()
      return
    }
    setSmsText('重发(' + sec + ')')
    timerRef.current = window.setTimeout(() => {
      _setTimeOut(sec - 1)
    }, 1000)
  }

  const _error = useCallback(
    (msg: string) => {
      show({
        icon: 'error',
        title: msg
      })
    },
    [show]
  )

  return (
    <Container navTitle='登录' className='pages-login-index'>
      <View className='section'>
        <View
          className='navigation_minibar_left_back back-btn'
          style={{
            width: `${34}px`,
            height: `${34}px`,
            marginRight: '10px'
          }}
          onClick={() => back({ to: 4, data: { isLogin: true } })}
        >
          <Icon name='arrow-left' />
        </View>
        <View className='right-top-sign' />
        <View className='logo'>
          <Image src={Images.DEFAULT_LOG_IMAGE} style={{ width: '140px', height: '120px' }}></Image>
        </View>
        <View className='login-form'>
          <View className='form'>
            {!phoneForm ? (
              <CellGroup>
                <Field
                  label='账号'
                  placeholder='支持账号/邮箱/手机号'
                  value={username}
                  onChange={(e: ITouchEvent) => {
                    setUsername(e.detail)
                  }}
                />
                <Field
                  label='密码'
                  password
                  placeholder='请输入密码'
                  value={password}
                  onChange={(e: ITouchEvent) => setPassword(e.detail)}
                  renderButton={
                    <Button size='small' plain type='info'>
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
                  onChange={(e: ITouchEvent) => setPhone(e.detail)}
                ></Field>
                <Field
                  label='验证码'
                  placeholder='请输入验证码'
                  maxlength={4}
                  type='number'
                  value={smsCode}
                  onChange={(e: ITouchEvent) => setSmsCode(e.detail)}
                  renderButton={
                    <Button size='small' plain type='info' hairline={false} disabled={smsLoading} onClick={pushCode}>
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

          <Button type='danger' block onClick={loginByPhoneOrUsername}>
            登录
          </Button>
        </View>
        <View className='self'>
          <Checkbox value={self} checkedColor='red' onChange={(e: any) => setSelf(e.detail)}>
            登录即已同意
            {env === 'WEAPP' ? (
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
        {env === 'WEAPP' && (
          <View className='btn' onClick={loginByCode}>
            <Image src={Images.DEFAULT_WECHAT_IMAGE} style={{ width: '36px', height: '36px' }} fit='heightFix' />
            <View className='label'>微信</View>
          </View>
        )}
      </View>
    </Container>
  )
}

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '登录'
})
