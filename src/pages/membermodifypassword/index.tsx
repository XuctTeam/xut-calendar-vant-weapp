/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-10 14:03:54
 * @FilePath: \xut-calendar-vant-weapp\src\pages\membermodifypassword\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, CellGroup, Field, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Header from '@/components/header'
import { useBack } from '@/utils/taro'
import Container from '@/components/container'
import { useToast } from 'taro-hooks'
import { password as updatePassword } from '@/api/user'

import './index.less'

export default Unite(
  {
    state: {
      password: '',
      comfirmPassword: '',
      loading: false
    },
    async onLoad() {},
    setPassword(password: string) {
      this.setState({
        password
      })
    },

    setComfirmPassword(comfirmPassword: string) {
      this.setState({
        comfirmPassword
      })
    },

    modifyPassword() {
      if (!this.state.password) {
        this.hooks['toast']({ title: '密码不能为空' })
        return
      }
      if (!this.state.comfirmPassword) {
        this.hooks['toast']({ title: '确认密码不能为空' })
        return
      }
      if (this.state.password !== this.state.comfirmPassword) {
        this.hooks['toast']({ title: '密码不一致' })
        return
      }
      this.setState({
        loading: true
      })
      updatePassword(this.state.password)
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
    const { password, comfirmPassword, loading } = state
    const { setPassword, setComfirmPassword, modifyPassword } = events
    const [back] = useBack({
      to: 4
    })
    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: toast,
      back: back
    })

    return (
      <Container
        navTitle='修改密码'
        enablePagePullDownRefresh={true}
        className='pages-member-modify-password-index'
        h5Nav={true}
        renderPageTopHeader={() => {
          return <Header title='修改密码' left to={4}></Header>
        }}
      >
        <View className='box'>
          <CellGroup inset>
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
              value={comfirmPassword}
              onChange={(e) => setComfirmPassword(e.detail.value)}
              onClear={() => setComfirmPassword('')}
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
