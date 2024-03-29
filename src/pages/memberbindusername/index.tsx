/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:09:19
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberbindusername\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useEffect } from 'react'
import { useToast } from 'taro-hooks'
import { Button, Cell, CellGroup, Form, FormItem } from '@antmjs/vantui'
import { Input, View } from '@tarojs/components'
import { useRecoilState } from 'recoil'
import { userAuthInfoStore } from '@/calendar/store/store'
import Container from '@/components/container'
import calendar from '@/calendar'

import './index.less'

export default Unite(
  {
    state: {
      loading: false
    },

    bindUserName() {
      this.hooks['form'].validateFields((errorMessage: any, fieldValues: any) => {
        if (errorMessage && errorMessage.length) {
          return console.info('errorMessage', errorMessage)
        }
        this.setState({
          loading: true
        })
        calendar.$api.user
          .bindUserName(fieldValues)
          .then(() => {
            this._success()
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading: false
            })
          })
      })
    },

    _success() {
      this.hooks['toast']()
      this.setState({
        loading: false
      })
      calendar.$api.user.auths().then((res) => {
        this.hooks['setUserAuthsState'](res.data)
        window.setTimeout(() => {
          this.hooks['back']()
        }, 1500)
      })
    }
  },
  function ({ state, events }) {
    const { loading } = state
    const { bindUserName } = events
    const [userAuths, setUserAuthsState] = useRecoilState(userAuthInfoStore)
    const userNameAuth = userAuths && userAuths.length > 0 ? userAuths.find((i) => i.identityType === 'user_name') : undefined
    const form = Form.useForm()
    const { show, hide } = useToast({ title: '绑定成功' })
    const [back] = calendar.$hooks.useBack({ to: 4 })
    const usedNav = calendar.$hooks.useNav()

    events.setHooks({
      form: form,
      show: show,
      hide: hide,
      back: back,
      setUserAuthsState: setUserAuthsState
    })

    useEffect(() => {
      if (userNameAuth) {
        form.setFieldsValue('username', userNameAuth.username)
      }
    }, [])

    return (
      <Container navTitle='用户名绑定' enablePagePullDownRefresh={false} className='pages-member-bind-username-index' useNav={usedNav} useMenuBtns={usedNav}>
        <Form form={form} className='van-page-box'>
          <CellGroup inset>
            <FormItem
              label='用户名'
              name='username'
              required
              rules={[
                {
                  message: '8到16位（字母、数字、下划线、减号）',
                  rule: /^[a-zA-Z0-9_-]{8,16}$/
                }
              ]}
              trigger='onInput'
              validateTrigger='onBlur'
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='用户名' disabled={!!userNameAuth} />
            </FormItem>
            <FormItem
              label='密码'
              name='password'
              required
              rules={[
                {
                  rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/,
                  message: '密码规则不匹配'
                }
              ]}
              trigger='onInput'
              validateTrigger='onBlur'
              valueFormat={(e) => e.detail.value}
            >
              <Input password placeholder='密码' disabled={!!userNameAuth} />
            </FormItem>
            <CellGroup title='密码规则' className='tips'>
              <Cell label='密码至少为8位的字母、数字和特殊符号的组合' />
            </CellGroup>
            <CellGroup title='备注' className='tips'>
              <Cell label='账号一旦绑定则无法解绑' />
            </CellGroup>
          </CellGroup>
        </Form>
        {!userNameAuth && (
          <View className='van-page-button'>
            <Button block type='info' disabled={loading} onClick={bindUserName}>
              保存
            </Button>
          </View>
        )}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
