/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:24:53
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-08 09:27:40
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\PhoneRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useToast } from 'taro-hooks'
import { Form, FormItem, CellGroup, Button, Row, Col } from '@antmjs/vantui'
import { checkMobile } from '@/utils'
import { sendRegisterSms } from '@/api/user'
import { Input } from '@tarojs/components'

interface IPageOption {
  form: any
}

const PhoneRegister: FunctionComponent<IPageOption> = (props) => {
  const [phoneSmsText, setPhoneSmsText] = useState<string>('发送验证码')
  const [phoneDisable, setPhoneDisable] = useState<boolean>(false)
  const smsCodeRef = useRef<number>(0)

  const [toast] = useToast({
    icon: 'error'
  })

  useEffect(() => {
    return () => {
      if (smsCodeRef.current > 0) {
        window.clearTimeout(smsCodeRef.current)
        smsCodeRef.current = 0
      }
    }
  }, [])

  const sendPhoneSmsCode = () => {
    const phone: string = props.form.getFieldValue('phone')
    if (!phone || !checkMobile(phone)) {
      toast({
        title: '手机号格式错误'
      })
      return
    }
    sendRegisterSms(phone)
      .then(() => {
        setPhoneSmsTextTime(120)
      })
      .catch((err) => {
        console.log(err)
        setPhoneDisable(false)
        setPhoneSmsText('发送验证码')
      })
  }

  const setPhoneSmsTextTime = (num: number) => {
    if (num === 0) {
      setPhoneSmsText('发送验证码')
      setPhoneDisable(false)

      if (smsCodeRef.current > 0) {
        window.clearTimeout(smsCodeRef.current)
        smsCodeRef.current = 0
      }
      return
    }
    setPhoneSmsText('重发(' + num + ')')
    setPhoneDisable(true)

    smsCodeRef.current = window.setTimeout(() => {
      setPhoneSmsTextTime(num - 1)
    }, 1000)
  }

  return (
    <Form className='form' form={props.form}>
      <CellGroup inset>
        <FormItem
          label='手机号'
          name='phone'
          required
          rules={[{ rule: /^1[3|4|5|8][0-9]\d{4,8}/, message: '手机号格式错误' }]}
          trigger='onInput'
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input placeholder='请输入手机号' />
        </FormItem>
        <FormItem
          label='密码'
          required
          name='password'
          rules={[{ rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, message: '8-30位且字母、数字和特殊符号组合' }]}
          trigger='onInput'
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input password placeholder='密码' />
        </FormItem>
        <FormItem label='验证码' name='code' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
          <Row gutter='20'>
            <Col span='13' className='dark'>
              <Input placeholder='请输入验证码' type='number' maxlength={6} />
            </Col>
            <Col span='11' className='dark'>
              <Button size='small' type='info' onClick={sendPhoneSmsCode} disabled={phoneDisable}>
                {phoneSmsText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </CellGroup>
    </Form>
  )
}

export default PhoneRegister
