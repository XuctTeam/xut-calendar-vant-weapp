/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:25:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-01 18:45:56
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\EmailRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Button, CellGroup, Col, Form, FormItem, Row } from '@antmjs/vantui'
import { Input } from '@tarojs/components'

import { useToast } from 'taro-hooks'
import { checkEmail } from '@/utils'
import { sendRegisterEmail } from '@/api/user'

interface IPageOption {
  form: any
}

const EmailRegister: FunctionComponent<IPageOption> = (props) => {
  const [emailSmsText, setEmailSmsText] = useState('发送验证码')
  const [emailDisable, setEmailDisable] = useState<boolean>(false)

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
    const mail: string = props.form.getFieldValue('email')
    if (!mail || !checkEmail(mail)) {
      toast({
        title: '邮箱格式错误'
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
    <Form form={props.form}>
      <CellGroup inset>
        <FormItem
          label='邮箱'
          name='email'
          rules={[{ rule: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: '邮箱格式错误' }]}
          trigger='onInput'
          required
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input placeholder='请输入邮箱' />
        </FormItem>
        <FormItem
          label='密码'
          name='password'
          rules={[{ rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, message: '8-30位且字母、数字和特殊符号组合' }]}
          trigger='onInput'
          required
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input password placeholder='密码' />
        </FormItem>
        <FormItem label='验证码' style={{ height: '40px' }} name='code' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
          <Row gutter='20'>
            <Col span='12'>
              <Input placeholder='请输入验证码' type='number' maxlength={6} />
            </Col>
            <Col span='12'>
              <Button size='small' plain type='info' className='op' onClick={sendEmailSmsCode} disabled={emailDisable}>
                {emailSmsText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </CellGroup>
    </Form>
  )
}
export default EmailRegister
