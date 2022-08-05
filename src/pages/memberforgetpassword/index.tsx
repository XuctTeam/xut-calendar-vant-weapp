/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-05 17:49:32
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberforgetpassword\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Steps, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import { Auth, Password } from './ui'
import { forgetPasswordCheck, forgetModify } from '@/api/forget'
import './index.less'

export default Unite(
  {
    state: {
      step: 0
    },
    async onLoad() {},

    checkMemberCode(phone: string, email: string, code: string, type: number) {
      forgetPasswordCheck(phone, email, code, type)
        .then((res) => {
          debugger
          //memberIdRef.current = res as any as string
          //codeRef.current = code
          this.setState({
            step: 2
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    modifyPassword(password: string) {
      //   forgetModify(memberIdRef.current, password, codeRef.current)
      //     .then(() => {
      //       toast({
      //         title: '修改成功'
      //       })
      //       window.setTimeout(() => {
      //         back({
      //           to: 6
      //         })
      //       }, 500)
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
    }
  },
  function ({ state, events }) {
    const { step } = state
    const { checkMemberCode, modifyPassword } = events

    return (
      <Container
        navTitle='忘记密码'
        enablePagePullDownRefresh={false}
        className='pages-member-forget-index'
        h5Nav
        renderPageTopHeader={() => {
          return <Header title='忘记密码' left to={4}></Header>
        }}
      >
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
