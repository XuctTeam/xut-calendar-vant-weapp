/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-20 18:18:44
 * @FilePath: \xut-calendar-vant-weapp\src\pages\membermodifyname\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, CellGroup, Field } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useRecoilState } from 'recoil'
import Container from '@/components/container'
import { userInfoStore } from '@/store'
import { updateName } from '@/api/user'
import { useToast } from 'taro-hooks'

import './index.less'
import { useBack } from '@/utils/taro'
import { useNav } from '@/utils'

export default Unite(
  {
    state: {
      name: '',
      loading: false
    },
    async onLoad() {},

    async onReady() {
      if (this.hooks['userInfoState']) {
        this.setState({
          name: this.hooks['userInfoState'].name
        })
      }
    },

    setName(name: string) {
      this.setState({
        name
      })
    },

    updateNames() {
      if (!this.state.name) {
        this.hooks['toast']({
          title: '名称不能为空'
        })
        return
      }
      this.setState({
        loading: true
      })
      updateName(this.state.name)
        .then(() => {
          this.hooks['setUserInfoState']({ ...this.hooks['userInfoState'], name: this.state.name })
          this.setState({
            loading: false
          })
          window.setTimeout(() => {
            this.hooks['back']()
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
    const [userInfoState, setUserInfoState] = useRecoilState(userInfoStore)
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 4
    })
    const usedNav = useNav()

    const { setName, updateNames } = events
    const { name, loading } = state

    events.setHooks({
      toast: toast,
      back: back,
      userInfoState: userInfoState,
      setUserInfoState: setUserInfoState
    })

    return (
      <Container navTitle='修改姓名' enablePagePullDownRefresh={false} className='pages-member-modidfy-name-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='van-page-box'>
          <Field label='姓名' required value={name} placeholder='请输入名称' border={false} onChange={(e) => setName(e.detail)} />
        </View>
        <View className='van-page-button'>
          <Button type='info' block loading={loading} onClick={updateNames}>
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
