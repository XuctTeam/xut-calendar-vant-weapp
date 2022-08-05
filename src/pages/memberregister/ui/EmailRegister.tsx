/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:25:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-05 18:44:31
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\EmailRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Button, CellGroup, Form, FormItem } from '@antmjs/vantui'
import { Input } from '@tarojs/components'
import { IFormInstanceAPI } from '@antmjs/vantui/types/form'

import { useToast } from 'taro-hooks'
import { checkEmail } from '@/utils'
import { sendRegisterEmail } from '@/api/user'

interface IPageOption {}

const EmailRegister: FunctionComponent<IPageOption & { ref: React.Ref<IFormInstanceAPI> }> = React.forwardRef((props, ref) => {
  const [emailSmsText, setEmailSmsText] = useState('发送验证码')
  const [emailDisable, setEmailDisable] = useState<boolean>(false)
  const emailItemRef = useRef()

  const emailSmsCodeRef = useRef<number>(0)
  const [toast] = useToast({
    icon: 'error'
  })

  useEffect(() => {
    return () => {
      if (emailSmsCodeRef.current > 0) {
        window.clearTimeout(emailSmsCodeRef.current)
        emailSmsCodeRef.current = 0
      }
    }
  }, [])

  const sendEmailSmsCode = () => {
    const mail: string = emailItemRef.current?.getValue()
    if (!mail || !checkEmail(mail)) {
      toast({
        title: '手机号格式错误'
      })
      return
    }
    sendRegisterEmail(mail)
      .then(() => {
        setEmailSmsTextTime(120)
      })
      .catch((err) => {
        console.log(err)
        setEmailDisable(false)
        setEmailSmsText('发送验证码')
      })
  }

  const setEmailSmsTextTime = (num: number) => {
    if (num === 0) {
      setEmailSmsText('发送验证码')
      setEmailDisable(false)

      if (emailSmsCodeRef.current > 0) {
        window.clearTimeout(emailSmsCodeRef.current)
        emailSmsCodeRef.current = 0
      }
      return
    }
    setEmailSmsText('重发(' + num + ')')
    setEmailDisable(true)

    emailSmsCodeRef.current = window.setTimeout(() => {
      setEmailSmsTextTime(num - 1)
    }, 1000)
  }

  return (
    <Form className='form' {...props} ref={ref}>
      <CellGroup inset>
        <FormItem label='邮箱' name='email' rules={[{ rule: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: '不为空或格式错误' }]}>
          <Input placeholder='请输入邮箱' />
        </FormItem>
        <FormItem
          label='密码'
          name='password'
          rules={[{ rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, message: '8-30位且字母、数字和特殊符号组合' }]}
        >
          <Input password placeholder='密码' />
        </FormItem>
        <FormItem label='验证码' className='captcha' name='code' required>
          <Input placeholder='请输入验证码' maxlength={4} />
          <Button size='small' color='primary' onClick={sendEmailSmsCode} disabled={emailDisable}>
            {emailSmsText}
          </Button>
        </FormItem>
      </CellGroup>
    </Form>
  )
})
export default EmailRegister
