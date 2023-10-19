/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:21:24
 * @FilePath: \xut-calendar-vant-weapp\src\pages\membermodifypassword\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, CellGroup, Field } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import calendar from '@/calendar'
import './index.less'
import { checkPassword as checkPassword } from '@/calendar/utils'

export default Unite(
  {
    state: {
      password: '',
      confirmPassword: '',
      loading: false
    },
    async onLoad() {},
    setPassword(password: string) {
      this.setState({
        password
      })
    },

    setConfirmPassword(confirmPassword: string) {
      this.setState({
        confirmPassword: confirmPassword
      })
    },

    modifyPassword() {
      if (!this.state.password) {
        this.hooks['toast']({ title: '密码不能为空' })
        return
      }
      if (!checkPassword(this.state.password)) {
        this.hooks['toast']({ title: '密码格式错误' })
        return
      }

      if (!this.state.confirmPassword) {
        this.hooks['toast']({ title: '确认密码不能为空' })
        return
      }
      if (!checkPassword(this.state.confirmPassword)) {
        this.hooks['toast']({ title: '确认密码格式错误' })
        return
      }
      if (this.state.password !== this.state.confirmPassword) {
        this.hooks['toast']({ title: '密码不一致' })
        return
      }
      this.setState({
        loading: true
      })
      calendar.$api.user
        .password(this.state.password)
        .then(() => {
          this.setState({
            loading: true
          })
          this.hooks['toast']({ title: '修改成功', icon: 'success' })
          window.setTimeout(() => {
            this.hooks['back']
          }, 1000)
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    }
  },
  function ({ state, events }) {
    const { password, confirmPassword: confirmPassword, loading } = state
    const { setPassword, setConfirmPassword: setConfirmPassword, modifyPassword } = events
    const usedNav = calendar.$hooks.useNav()
    const [back] = calendar.$hooks.useBack({ to: 4 })
    const { show } = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: show,
      back: back
    })

    return (
      <Container navTitle='修改密码' enablePagePullDownRefresh={false} className='pages-member-modify-password-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='box'>
          <CellGroup inset className='van-form-cell-group'>
            <Field
              label='密码'
              required
              placeholder='请输入密码'
              maxlength={16}
              type='password'
              clearable
              value={password}
              onChange={(e) => setPassword(e.detail)}
              onClear={() => setPassword('')}
            ></Field>
            <Field
              label='确认密码'
              required
              placeholder='请输入确认密码'
              maxlength={16}
              clearable
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.detail.value)}
              onClear={() => setConfirmPassword('')}
            ></Field>
          </CellGroup>
        </View>
        <View className='button'>
          <Button type='info' block loading={loading} onClick={() => modifyPassword()}>
            保存
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
