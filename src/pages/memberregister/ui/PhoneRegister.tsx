/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:24:53
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-04 01:23:58
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
import { create } from '@/utils/countdown'

interface IPageOption {
  form: any
}

const PhoneRegister: FunctionComponent<IPageOption> = (props) => {
  const [phoneSmsText, setPhoneSmsText] = useState<string>('发送验证码')
  const [phoneDisable, setPhoneDisable] = useState<boolean>(false)

  const countDownRef = useRef<any>()

  const [toast] = useToast({
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
      console.log('close timer')
      countDownRef.current.clean()
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
        countDownRef.current.start(0, 2, 0)
      })
      .catch((err) => {
        console.log(err)
        setPhoneDisable(false)
        setPhoneSmsText('发送验证码')
      })
  }

  const setSmsText = (num) => {
    setPhoneSmsText('重发(' + num + ')')
  }

  const setSmsTextEnd = () => {
    setPhoneSmsText('发送验证码')
    setPhoneDisable(false)
  }

  return (
    <Form form={props.form}>
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
        <FormItem label='验证码' style={{ height: '40px' }} name='code' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
          <Row gutter='20'>
            <Col span='12'>
              <Input placeholder='请输入验证码' type='number' maxlength={6} />
            </Col>
            <Col span='12'>
              <Button size='small' className='op' plain type='info' onClick={sendPhoneSmsCode} disabled={phoneDisable}>
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
