/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-19 15:39:00
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindemail\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useRecoilState } from 'recoil'
import { useEffect, useRef } from 'react'
import { Button, CellGroup, Col, Form, FormItem, Row } from '@antmjs/vantui'
import { Input, View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import { userAuthInfoStore } from '@/store'
import { checkEmail, useNav } from '@/utils'
import { bindEmail, unbindEmail, auths } from '@/api/user'
import { sendEmailCode } from '@/api/common'
import { IUserAuth } from '~/../types/user'
import { useBack } from '@/utils/taro'
import { create } from '@/utils/countdown'

import './index.less'

export default Unite(
  {
    state: {
      smsText: '发送验证码',
      disable: false,
      loading: false
    },

    sendSmsCode() {
      const email = this.hooks['form'].getFieldValue('email')
      if (!(email && checkEmail(email))) {
        this.hooks['toast']({
          title: '邮箱不能为空'
        })
        return
      }
      sendEmailCode(email, this.hooks['emailAuth'] ? 2 : 1)
        .then(() => {})
        .catch((err: any) => {
          console.log(err)
        })
      this._setTextTime()
    },

    _setTextTime() {
      this.hooks['countDownRef'].current.start(0, 2, 0)
      this.setState({
        disable: true
      })
    },

    setSmsText(counter: number) {
      this.setState({
        smsText: '重发(' + counter + ')'
      })
    },

    setSmsTextEnd() {
      this.setState({
        smsText: '发送验证码',
        disable: false
      })
    },

    bindEmail() {
      this.hooks['form'].validateFields((errorMessage: any, fieldValues: any) => {
        if (errorMessage && errorMessage.length) {
          return console.info('errorMessage', errorMessage)
        }
        this.setState({
          loading: true
        })
        const { email, code } = fieldValues
        if (this.hooks['emailAuth']) {
          unbindEmail(email, code)
            .then(() => {
              this.hooks['toast']({
                icon: 'success',
                title: '解绑成功'
              })
              this._reload()
            })
            .catch((err) => {
              console.log(err)
              this.setState({
                loading: false
              })
            })
          return
        }
        bindEmail(email, code)
          .then(async () => {
            this.hooks['toast']({
              icon: 'success',
              title: '绑定成功'
            })
            this._reload()
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading: false
            })
          })
      })
    },

    _reload() {
      auths()
        .then((res) => {
          this.hooks['setUserAuthsState'](res as IUserAuth[])
          this.setState({
            disable: false,
            loading: false
          })
          window.setTimeout(() => {
            this.hooks['back']()
          }, 1500)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  function ({ state, events }) {
    const { smsText, disable, loading } = state
    const { sendSmsCode, bindEmail, setSmsText, setSmsTextEnd } = events
    const form = Form.useForm()
    const usedNav = useNav()
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 4
    })
    const countDownRef = useRef<any>()

    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const emailAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'email') : undefined

    events.setHooks({
      toast: toast,
      back: back,
      form: form,
      countDownRef: countDownRef,
      emailAuth: emailAuth,
      userAuths: userAuths,
      setUserAuthsState: setUserAuthsState
    })

    useEffect(() => {
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
      if (emailAuth) {
        form.setFields({ email: emailAuth.username })
      }
      return () => {
        countDownRef.current.clean()
      }
    }, [])

    return (
      <Container navTitle='邮箱绑定' enablePagePullDownRefresh={false} className='pages-member-bind-email-index' useNav={usedNav} useMenuBtns={usedNav}>
        <Form form={form} className='van-page-box'>
          <CellGroup inset>
            <FormItem
              label='邮箱'
              name='email'
              required
              trigger='onInput'
              validateTrigger='onBlur'
              rules={[{ rule: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: '邮箱格式错误' }]}
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='请输入邮箱' disabled={!!emailAuth}></Input>
            </FormItem>
            <FormItem label='验证码' name='code' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
              <Row gutter='20' className='van-sms-cell'>
                <Col span='13' className='dark'>
                  <Input placeholder='请输入验证码' type='number' maxlength={6} />
                </Col>
                <Col span='11' className='dark'>
                  <Button size='small' plain type='info' onClick={sendSmsCode} disabled={disable}>
                    {smsText}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </CellGroup>
        </Form>
        <View className='van-page-button'>
          <Button block type='info' disabled={loading} onClick={bindEmail}>
            {emailAuth ? '解绑' : '绑定'}
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
