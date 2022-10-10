/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-10 17:32:54
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindphone\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useEffect, useRef } from 'react'
import Router from 'tarojs-router-next'
import { useRecoilState } from 'recoil'
import { Button, Cell, CellGroup, Col, Form, FormItem, Row } from '@antmjs/vantui'
import { Input, View, Button as TaroButton, ButtonProps } from '@tarojs/components'
import { useLogin, useToast } from 'taro-hooks'
import Container from '@/components/container'
import { userAuthInfoStore } from '@/store'
import { checkMobile, useNav } from '@/utils'
import { sendSmsCode } from '@/api/common'
import { IUserAuth } from '~/../types/user'
import { useBack } from '@/utils/taro'
import { getPhoneNumber, logout, bindPhone, unbindPhone, auths } from '@/api/user'
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
      const phone = this.hooks['form'].getFieldValue('phone')
      if (!(phone && checkMobile(phone))) {
        this.hooks['toast']({
          title: '手机号码格式错误'
        })
        return
      }
      this._setSmsTextTime()
      sendSmsCode(!!this.hooks['phoneAuth'], phone)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _setSmsTextTime() {
      //const { countDown } = this.hooks
      this.hooks['countDownRef'].current.start(0, 2, 0)
      this.setState({
        disable: true
      })
    },

    setSmsText(counter: any) {
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
        this.setState({
          loading: true
        })
        const { phone, code } = fieldValues
        const that = this
        const edit = !!this.hooks['phoneAuth']
        if (edit) {
          /**绑定 */
          unbindPhone(phone, code)
            .then(() => {
              this._optPhoneSuccess('解绑成功')
            })
            .catch((err) => {
              console.log(err)
              this.setState({
                loading: false
              })
            })
          return
        }
        bindPhone(phone, code)
          .then((res) => {
            const { exist, merge } = res
            if (exist && merge) {
              that.setState({
                loading: false,
                smsText: '发送验证码'
              })
              this.hooks['countDownRef'].current.clean()
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
            this.setState({
              loading: false
            })
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
        icon: 'success',
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
    const { sendSmsCode, setSmsText, bindPhone, setSmsTextEnd, onGetPhoneNumber, uuid } = events
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const phoneAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'phone') : undefined
    const countDownRef = useRef<any>()
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 4
    })
    const [checkSession] = useLogin()
    const isWechat = process.env.TARO_ENV === 'weapp' && !!phoneAuth
    const usedNav = useNav()

    events.setHooks({
      toast: toast,
      back: back,
      form: form,
      countDownRef: countDownRef,
      checkSession: checkSession,
      phoneAuth: phoneAuth,
      setUserAuthsState: setUserAuthsState
    })

    useEffect(() => {
      if (phoneAuth) {
        form.setFieldsValue('phone', phoneAuth.username)
      }
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
      <Container navTitle='手机绑定' enablePagePullDownRefresh={false} className='pages-member-bind-phone-index' useNav={usedNav} showMenuBtns={usedNav}>
        <Form form={form} className='van-page-box'>
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
                  <Button size='small' plain type='info' onClick={sendSmsCode} disabled={disable}>
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
        <View className='van-page-button'>
          <Row>
            {isWechat && (
              <Col span='12'>
                <TaroButton className='van-btn' type='warn' openType='getPhoneNumber' onGetPhoneNumber={(e: any) => onGetPhoneNumber(e)}>
                  获取本机号码
                </TaroButton>
              </Col>
            )}
            <Col span={isWechat ? 12 : 24}>
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
