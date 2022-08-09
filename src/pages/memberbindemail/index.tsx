/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-09 18:38:09
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindemail\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { Button, CellGroup, Col, Form, FormItem, Row, Unite } from '@antmjs/vantui'
import { Input, View } from '@tarojs/components'
import Header from '@/components/header'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import { userAuthInfoStore } from '@/store'
import { checkEmail } from '@/utils'
import { bindEmail, unbindEmail, auths } from '@/api/user'
import { sendUmsEmailCode } from '@/api/common'
import { IUserAuth } from '~/../types/user'
import { useBack } from '@/utils/taro'
import CountDown from '@/components/countdown'
import './index.less'

export default Unite(
  {
    state: {
      smsText: '发送验证码',
      disable: false,
      loading: false
    },

    async onUnload() {
      this.hooks['countDown'].clean()
    },

    sendSmsCode() {
      const email = this.hooks['form'].getFieldValue('email')
      if (!(email && checkEmail(email))) {
        this.hooks['toast']({
          title: '邮箱不能为空'
        })
        return
      }
      this._setTextTime()

      sendUmsEmailCode(email, this.hooks['emailAuth'] ? 2 : 1)
        .then(() => {})
        .catch((err: any) => {
          console.log(err)
        })
    },

    _setTextTime() {
      const { countDown } = this.hooks
      countDown.reset()
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
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 4
    })
    const countDown = new CountDown({
      interval: 120,
      onStep({ counter, diff }) {
        console.log(counter, diff)
        setSmsText(diff)
      },
      onEnd() {
        setSmsTextEnd()
      }
    })

    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const emailAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'email') : undefined

    events.setHooks({
      toast: toast,
      back: back,
      form: form,
      countDown: countDown,
      emailAuth: emailAuth,
      userAuths: userAuths,
      setUserAuthsState: setUserAuthsState
    })

    useEffect(() => {
      if (emailAuth) {
        form.setFields({ email: emailAuth.username })
      }
    }, [])

    return (
      <Container
        navTitle='邮箱绑定'
        enablePagePullDownRefresh={false}
        className='pages-member-bind-email-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='邮箱绑定' left to={4}></Header>
        }}
      >
        <Form form={form} className='box'>
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
                  <Button size='small' type='info' onClick={sendSmsCode} disabled={disable}>
                    {smsText}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </CellGroup>
        </Form>
        <View className='button'>
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
