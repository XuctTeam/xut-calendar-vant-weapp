/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-19 15:39:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberforgetpassword\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Steps } from '@antmjs/vantui'
import Container from '@/components/container'
import { Auth, Password } from './ui'
import { forgetPasswordCheck, forgetModify } from '@/api/forget'
import './index.less'
import { useRef } from 'react'
import { useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'
import { useNav } from '@/utils'

export default Unite(
  {
    state: {
      step: 0
    },
    async onLoad() {},

    checkMemberCode(phone: string, email: string, code: string, type: number) {
      forgetPasswordCheck(phone, email, code, type)
        .then((res) => {
          this.hooks['memberIdRef'].current = res as any as string
          this.hooks['codeRef'].current = code
          this.setState({
            step: 2
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    modifyPassword(password: string) {
      forgetModify(this.hooks['memberIdRef'].current, password, this.hooks['codeRef'].current)
        .then(() => {
          this.hooks['toast']({
            title: '修改成功'
          })
          window.setTimeout(() => {
            this.hooks['back']()
          }, 1000)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  function ({ state, events }) {
    const { step } = state
    const { checkMemberCode, modifyPassword } = events
    const [toast] = useToast({
      icon: 'success',
      title: '修改成功'
    })
    const [back] = useBack({
      to: 6
    })
    const memberIdRef = useRef<string>('')
    const codeRef = useRef<number>(-1)
    const usedNav = useNav()
    events.setHooks({
      toast: toast,
      back: back,
      memberIdRef: memberIdRef,
      codeRef: codeRef
    })

    return (
      <Container navTitle='忘记密码' enablePagePullDownRefresh={false} className='pages-member-forget-index' useNav={usedNav} useMenuBtns={usedNav}>
        <Steps
          active={step}
          steps={[
            {
              text: '验证账号',
              desc: '有效的手机或邮箱'
            },
            {
              text: '重置密码',
              desc: '满足条件的密码'
            }
          ]}
        ></Steps>
        {step === 0 ? <Auth checkMemberCode={checkMemberCode}></Auth> : <Password modifyPassword={modifyPassword}></Password>}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
