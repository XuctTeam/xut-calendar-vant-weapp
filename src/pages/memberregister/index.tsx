/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-10 13:23:08
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Header from '@/components/header'
import { Button, Icon, Form } from '@antmjs/vantui'
import { Swiper, SwiperItem, View } from '@tarojs/components'
import Container from '@/components/container'
import { useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'
import { register } from '@/api/user'
import { UserNameRegister, PhoneRegister, EmailRegister } from './ui'
import dayjs from 'dayjs'
import { useNav } from '@/utils'
import './index.less'

interface IUserNameForm {
  captcha: string
  password: string
  username: string
}

interface IEmailForm {
  email: string
  password: string
  code: string
}

interface IPhoneForm {
  phone: string
  password: string
  code: string
}

export default Unite(
  {
    state: {
      formType: 0,
      randomStr: (Math.random() + dayjs().valueOf()).toString(),
      loading: false
    },
    async onLoad() {
      //this.getCaptcha()
    },

    getCaptcha() {
      this.setState({
        randomStr: (Math.random() + dayjs().valueOf()).toString()
      })
    },

    setFormType(formType: number) {
      this.setState({
        formType
      })
    },

    registerHandler() {
      let ref
      switch (this.state.formType) {
        case 0:
          ref = this.hooks['userRef']
          break
        case 1:
          ref = this.hooks['phoneRef']
          break
        case 2:
          ref = this.hooks['emailRef']
          break
      }
      if (!ref) return
      ref.validateFields((errorMessage: any, fieldValues: any) => {
        if (errorMessage && errorMessage.length) {
          return console.info('errorMessage', errorMessage)
        }
        this._setLoading(true)
        switch (this.state.formType) {
          case 0:
            this._userNameRegister(fieldValues)
            break
          case 1:
            this._phoneRegister(fieldValues)
            break
          case 2:
            this._emailRegister(fieldValues)
            break
        }
      })
    },

    _userNameRegister(data: IUserNameForm) {
      register({
        formType: this.state.formType,
        username: {
          username: data.username,
          password: data.password,
          // key: this.state.key,
          captcha: data.captcha
        }
      })
        .then(() => {
          this._success()
        })
        .catch((err) => {
          console.log(err)
          this._setLoading(false)
        })
    },

    _phoneRegister(data: IPhoneForm) {
      register({
        formType: this.state.formType,
        phone: {
          phone: data.phone,
          password: data.password,
          smsCode: data.code
        }
      })
        .then(() => {
          this._success()
        })
        .catch((err) => {
          console.log(err)
          this._setLoading(false)
        })
    },

    _emailRegister(data: IEmailForm) {
      register({
        formType: this.state.formType,
        email: {
          email: data.email,
          password: data.password,
          code: data.code
        }
      })
        .then(() => {
          this._success()
        })
        .catch((err: any) => {
          console.log(err)
          this._setLoading(false)
        })
    },

    _success() {
      this._setLoading(false)
      this.hooks['toast']({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        this.hooks['back']({ to: 4 })
      }, 1500)
    },

    _setLoading(loading: boolean) {
      this.setState({
        loading: loading
      })
    }
  },
  function ({ state, events }) {
    const { randomStr, formType, loading } = state
    const { setFormType, registerHandler, getCaptcha } = events
    const userRef = Form.useForm()
    const emailRef = Form.useForm()
    const phoneRef = Form.useForm()
    const usedNav = useNav()

    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack()
    events.setHooks({
      toast: toast,
      back: back,
      userRef: userRef,
      emailRef: emailRef,
      phoneRef: phoneRef
    })

    return (
      <Container navTitle='用户注册' enablePagePullDownRefresh={false} useNav={usedNav} showMenuBtns={usedNav} className='pages-member-reigster-index'>
        <View className='box'>
          <Swiper
            autoplay={false}
            current={formType}
            style={{ height: '300px' }}
            onChange={(e) => {
              if (e.detail.current === undefined) return
              setFormType(e.detail.current)
            }}
          >
            <SwiperItem>
              <UserNameRegister form={userRef} randomStr={randomStr} getCaptcha={getCaptcha}></UserNameRegister>
            </SwiperItem>
            <SwiperItem>
              <PhoneRegister form={phoneRef}></PhoneRegister>
            </SwiperItem>
            <SwiperItem>
              <EmailRegister form={emailRef}></EmailRegister>
            </SwiperItem>
          </Swiper>
        </View>
        <View className='button'>
          <View className='thirdWrap'>
            {formType !== 0 && (
              <View className='itemWrap' onClick={() => setFormType(0)}>
                <Icon classPrefix='page-icon' name='icon-account' size={36} />
                <View className='label'>账号</View>
              </View>
            )}
            {formType !== 1 && (
              <View className='itemWrap' onClick={() => setFormType(1)}>
                <Icon classPrefix='page-icon' name='shouji' size={36} />
                <View className='label'>手机</View>
              </View>
            )}
            {formType !== 2 && (
              <View className='itemWrap' onClick={() => setFormType(2)}>
                <Icon classPrefix='page-icon' name='youxiang' size={36} />
                <View className='label'>邮箱</View>
              </View>
            )}
          </View>
          <Button block type='warning' disabled={loading} onClick={registerHandler}>
            注册
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
