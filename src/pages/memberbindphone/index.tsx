/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-09 18:34:27
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindphone\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useRecoilState } from 'recoil'
import { Button, Cell, CellGroup, Col, Form, FormItem, Row, Unite } from '@antmjs/vantui'
import { Input, View, Button as TaroButton, ButtonProps, CommonEventFunction } from '@tarojs/components'
import { useLogin, useToast } from 'taro-hooks'
import Container from '@/components/container'
import Header from '@/components/header'
import { userAuthInfoStore } from '@/store'
import { checkMobile } from '@/utils'
import { sendUmsSmsCode } from '@/api/common'
import { IUserAuth } from '~/../types/user'
import { getPhoneNumber, logout, bindPhone, unbindPhone, auths } from '@/api/user'
import CountDown from '@/components/countdown'

import './index.less'

export default Unite(
  {
    state: {
      smsText: '发送验证码',
      disable: false,
      loading: false
    },

    async onunload() {
      this.hooks['countDown'].clean()
    },

    sendSmsCode() {
      const phone = this.hooks['form'].getFieldValue('phone')
      if (!(phone && checkMobile(phone))) {
        this.hooks['toast']({
          title: '手机号码格式错误'
        })
        return
      }
      this._setSmsTextTime()
      sendUmsSmsCode(!!this.hooks['phoneAuth'], phone)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _setSmsTextTime() {
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

    bindPhone() {
      this.hooks['form'].validateFields((errorMessage: any, fieldValues: any) => {
        if (errorMessage && errorMessage.length) {
          return console.info('errorMessage', errorMessage)
        }
        const { phone, code } = fieldValues
        const edit = !!this.hooks['phoneAuth']
        if (edit) {
          /**绑定 */
          unbindPhone(phone, code)
            .then(() => {
              this._optPhoneSuccess('解绑成功')
            })
            .catch((err) => {
              console.log(err)
            })
          return
        }
        bindPhone(phone, code)
          .then((res) => {
            const { exist, merge } = res
            if (exist && merge) {
              Router.toMemberaccountmerge({
                params: {
                  phone
                }
              })
              return
            }
            this._optPhoneSuccess('绑定成功')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },

    async onGetPhoneNumber(e: ButtonProps.onGetPhoneNumberEventDetail) {
      if (e.errMsg && e.errMsg !== 'getPhoneNumber:ok') {
        this.hooks['toast']({ title: '获取手机失败' })
        return
      }
      try {
        await this.hooks['checkSession']()
      } catch (error) {
        console.log(error)
      }
      //获取手机号码
      this._getUserPhone(e.code || '')
    },

    _getUserPhone(code: string) {
      if (!code) return
      getPhoneNumber(code)
        .then((res) => {
          this.hooks['form'].setFieldsValue('phone', res as string)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _optPhoneSuccess(title: string) {
      this.hooks['toast']({
        title
      })
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
    const form = Form.useForm()
    const { smsText, disable, loading } = state
    const { sendSmsCode, setSmsText, bindPhone, setSmsTextEnd, onGetPhoneNumber } = events
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const phoneAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'phone') : undefined
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
    const [toast] = useToast({
      icon: 'error'
    })
    const [checkSession] = useLogin()

    events.setHooks({
      toast: toast,
      form: form,
      checkSession: checkSession,
      phoneAuth: phoneAuth,
      countDown: countDown,
      setUserAuthsState: setUserAuthsState
    })

    return (
      <Container
        navTitle='手机绑定'
        enablePagePullDownRefresh={false}
        className='pages-member-bind-phone-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='手机绑定' left to={4}></Header>
        }}
      >
        <Form form={form} className='box'>
          <CellGroup inset>
            <FormItem
              label='手机号'
              name='phone'
              required
              trigger='onInput'
              validateTrigger='onBlur'
              rules={[{ rule: /^1[3|4|5|8][0-9]\d{4,8}/, message: '手机号格式错误' }]}
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='请输入手机号' disabled={!!phoneAuth}></Input>
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
        <CellGroup inset>
          <Cell label='解绑手机号后日程将无法同步~~' />
        </CellGroup>
        <View className='button'>
          <Row>
            {process.env.TARO_ENV === 'weapp' && !!phoneAuth && (
              <Col span='12'>
                <TaroButton type='warn' openType='getPhoneNumber' onGetPhoneNumber={(e: any) => onGetPhoneNumber(e)}>
                  获取本机号码
                </TaroButton>
              </Col>
            )}
            <Col span='12'>
              <Button block type='info' disabled={loading} onClick={bindPhone}>
                {phoneAuth ? '解绑' : '绑定'}
              </Button>
            </Col>
          </Row>
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
