/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-08 10:57:00
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindemail\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useRecoilState } from 'recoil'
import { useEffect, useRef } from 'react'
import { Button, CellGroup, Field, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Header from '@/components/header'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import { userAuthInfoStore } from '@/store'
import { checkEmail } from '@/utils'
import { bindEmail, unbindEmail, auths } from '@/api/user'
import { sendUmsEmailCode } from '@/api/common'
import { IUserAuth } from '~/../types/user'
import { useBack } from '@/utils/taro'
import './index.less'

export default Unite(
  {
    state: {
      email: '',
      smsCode: '',
      smsText: '发送验证码',
      disable: false,
      loading: false,
    },

    async onLoad() {},

    async onReady() {},

    async onUnload() {
      this._cleanTime()
    },

    setEmail(email: string) {
      this.setState({
        email,
      })
    },

    setSmsCode(smsCode: string) {
      this.setState({
        smsCode,
      })
    },

    sendSmsCode() {
      if (!this._checkParam()) return
      sendUmsEmailCode(this.state.email, this.hooks['emailAuth'] ? 2 : 1)
        .then(() => {
          this._setTextTime(120)
        })
        .catch((err: any) => {
          console.log(err)
        })
    },

    _setTextTime(num: number) {
      if (num === 0) {
        this.setState({
          smsText: '发送验证码',
          disable: false,
        })
        this._cleanTime()
        return
      }
      this.setState({
        smsText: '重发(' + num + ')',
        disable: true,
      })
      this.hooks['timerRef'].current = window.setTimeout(() => {
        this._setTextTime(num - 1)
      }, 1000)
    },

    bindEmail() {
      if (!this._checkParam()) return
      if (!this.state.smsCode) {
        this.hooks['toast']({
          title: '验证码为空',
        })
        return
      }
      this.setState({
        loading: true,
      })
      if (this.hooks['emailAuth']) {
        unbindEmail(this.state.email, this.state.smsCode)
          .then(() => {
            this.hooks['toast']({
              icon: 'success',
              title: '解绑成功',
            })
            this._reload()
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading: false,
            })
          })
        return
      }
      bindEmail(this.state.email, this.state.smsCode)
        .then(async () => {
          this.hooks['toast']({
            icon: 'success',
            title: '绑定成功',
          })
          this._reload()
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false,
          })
        })
    },

    _checkParam() {
      if (!this.state.email || !checkEmail(this.state.email)) {
        this.hooks['toast']({
          title: '邮箱格式错误',
        })
        return false
      }
      return true
    },

    _reload() {
      auths()
        .then((res) => {
          this.hooks['setUserAuthsState'](res as IUserAuth[])
          this.setState({
            disable: false,
            loading: false,
          })
          window.setTimeout(() => {
            this.hooks['back']()
          }, 1500)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    _cleanTime() {
      if (this.hooks['timerRef'].current > 0) {
        window.clearTimeout(this.hooks['timerRef'].current)
        this.hooks['timerRef'].current = 0
      }
    },
  },
  function ({ state, events }) {
    const { email, smsCode, smsText, disable, loading } = state
    const { setEmail, setSmsCode, sendSmsCode, bindEmail } = events
    const timerRef = useRef<number>(0)
    const [toast] = useToast({
      icon: 'error',
    })
    const [back] = useBack({
      to: 4,
    })
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const emailAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'email')
        : undefined

    events.setHooks({
      toast: toast,
      back: back,
      timerRef: timerRef,
      emailAuth: emailAuth,
      userAuths: userAuths,
      setUserAuthsState: setUserAuthsState,
    })

    useEffect(() => {
      if (emailAuth) {
        setEmail(emailAuth.username)
      }
    }, [])

    return (
      <Container
        navTitle="邮箱绑定"
        enablePagePullDownRefresh={false}
        className="pages-member-bind-email-index"
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title="邮箱绑定" left to={4}></Header>
        }}
      >
        <View className="box">
          <CellGroup inset>
            <Field
              label="邮箱"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.detail)}
            ></Field>
            <Field
              label="验证码"
              placeholder="请输入验证码"
              value={smsCode}
              type="number"
              maxlength={6}
              onChange={(e) => setSmsCode(e.detail)}
              renderButton={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => sendSmsCode()}
                  disabled={disable}
                >
                  {smsText}
                </Button>
              }
            ></Field>
          </CellGroup>
        </View>
        <View className="button">
          <Button block type="info" disabled={loading} onClick={bindEmail}>
            {emailAuth ? '解绑' : '绑定'}
          </Button>
        </View>
      </Container>
    )
  },
  { page: true },
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '',
})
