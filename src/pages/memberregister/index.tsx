/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 18:23:27
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, Icon, Form } from '@antmjs/vantui'
import { Swiper, SwiperItem, View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import dayjs from 'dayjs'
import Container from '@/components/container'
import calendar from '@/calendar'
import { UserNameRegister, PhoneRegister, EmailRegister } from './ui'
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
      calendar.$api.user
        .register({
          formType: 'username',
          username: Object.assign({ ...data }, { randomStr: this.state.randomStr })
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
      calendar.$api.user
        .register({
          formType: 'phone',
          phone: {
            ...data
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
      calendar.$api.user
        .register({
          formType: 'email',
          email: {
            ...data
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
    const usedNav = calendar.$hooks.useNav()
    const back = calendar.$hooks.back({ to: 1 })

    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: toast,
      back: back,
      userRef: userRef,
      emailRef: emailRef,
      phoneRef: phoneRef
    })

    return (
      <Container navTitle='用户注册' enablePagePullDownRefresh={false} useNav={usedNav} useMenuBtns={usedNav} className='pages-member-reigster-index'>
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
