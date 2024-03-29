/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:24:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-06-13 12:40:00
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\UserNameRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import { FC } from 'react'
import { Input, View, Image } from '@tarojs/components'
import { CellGroup, Form, FormItem } from '@antmjs/vantui'

import { DEFAULT_SERVICES } from '@/calendar/constants/url'

interface IPageOption {
  randomStr: string
  form: any
  getCaptcha: () => void
}

const UserNameRegister: FC<IPageOption> = (props) => {
  const { randomStr } = props
  return (
    <Form form={props.form}>
      <CellGroup inset>
        <FormItem
          label='用户名'
          required
          name='username'
          rules={[{ message: '8-16位且至少一个字母和一个数字', rule: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/ }]}
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
        <FormItem label='图形码' name='captcha' required trigger='onInput' validateTrigger='onBlur' valueFormat={(e) => e.detail.value}>
          <View className='image-item'>
            <Input placeholder='请输入图形码' maxlength={5} />
            <View className='op'>
              <Image src={DEFAULT_SERVICES + '/code?imgType=register&randomStr=' + randomStr} onClick={props.getCaptcha} />
            </View>
          </View>
        </FormItem>
      </CellGroup>
    </Form>
  )
}

export default UserNameRegister
