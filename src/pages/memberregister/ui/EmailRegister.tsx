/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:25:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 08:52:12
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\EmailRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Button, CellGroup, Col, Form, FormItem, Row } from '@antmjs/vantui'
import { Input } from '@tarojs/components'

import { useToast } from 'taro-hooks'
import { checkEmail } from '@/calendar/utils'
import { create } from '@/utils/countdown'
import calendar from '@/calendar'

interface IPageOption {
  form: any
}

const EmailRegister: FunctionComponent<IPageOption> = (props) => {
  const [emailSmsText, setEmailSmsText] = useState('发送验证码')
  const [emailDisable, setEmailDisable] = useState<boolean>(false)
  const countDownRef = useRef<any>()

  const { show } = useToast({
    icon: 'error'
  })

  useEffect(() => {
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
      console.log('email close timer')
      countDownRef.current.clean()
    }
  }, [])

  const sendEmailSmsCode = () => {
    const mail: string = props.form.getFieldValue('email')
    if (!mail || !checkEmail(mail)) {
      show({
        title: '邮箱格式错误'
      })
      return
    }
    calendar.$api.user
      .sendRegisterEmail(mail)
      .then(() => {
        setEmailDisable(true)
        countDownRef.current.start(0, 2, 0)
      })
      .catch((err) => {
        console.log(err)
        setEmailDisable(false)
        setEmailSmsText('发送验证码')
      })
  }

  const setSmsText = (num) => {
    setEmailSmsText('重发(' + num + ')')
  }

  const setSmsTextEnd = () => {
    setEmailSmsText('发送验证码')
    setEmailDisable(false)
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
