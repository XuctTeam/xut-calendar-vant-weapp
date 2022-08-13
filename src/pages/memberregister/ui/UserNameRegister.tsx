/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:24:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-06 14:41:46
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\UserNameRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import { FC } from 'react'
import { Input } from '@tarojs/components'
import { CellGroup, Col, Form, FormItem, Row } from '@antmjs/vantui'
import { Image } from '@tarojs/components'

interface IPageOption {
  image: string
  getCaptcha: () => void
  form: any
}

const UserNameRegister: FC<IPageOption> = (props) => {
  return (
    <Form className='form' form={props.form}>
      <CellGroup inset>
        <FormItem
          label='用户名'
          required
          name='username'
          rules={[{ message: '8-16位且为字母、数字、下划线、减号', rule: /^[a-zA-Z0-9_-]{8,16}$/ }]}
          trigger='onInput'
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input placeholder='用户名' />
        </FormItem>
        <FormItem
          label='密码'
          name='password'
          required
          rules={[{ rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, message: '8-30位且字母、数字和特殊符号组合' }]}
          trigger='onInput'
          validateTrigger='onBlur'
          valueFormat={(e) => e.detail.value}
        >
          <Input password placeholder='密码' />
        </FormItem>
        <FormItem label='图形码' className='captcha' name='captcha' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
          <Row gutter='20'>
            <Col span='14' className='dark'>
              <Input placeholder='请输入图形码' maxlength={5} />
            </Col>
            <Col span='10' className='dark' style={{ height: '30px' }}>
              {props.image && <Image src={props.image} style={{ marginTop: '-4px' }} onClick={props.getCaptcha} />}
            </Col>
          </Row>
        </FormItem>
      </CellGroup>
    </Form>
  )
}

export default UserNameRegister