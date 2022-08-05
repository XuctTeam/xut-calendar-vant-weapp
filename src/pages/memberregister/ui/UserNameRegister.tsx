/*
 * @Author: Derek Xu
 * @Date: 2022-05-03 20:24:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-05 18:44:01
 * @FilePath: \xut-calendar-vant-weapp\src\pages\memberregister\ui\UserNameRegister.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */

import React, { FunctionComponent } from 'react'
import { Input } from '@tarojs/components'
import { CellGroup, Form, FormItem } from '@antmjs/vantui'
import { Image } from '@tarojs/components'
import { IFormInstanceAPI } from '@antmjs/vantui/types/form'

interface IPageOption {
  image: string
  getCaptcha: () => void
}

const UserNameRegister: FunctionComponent<IPageOption & { ref: React.Ref<IFormInstanceAPI> }> = React.forwardRef((props, ref) => {
  return (
    <Form className='form' ref={ref}>
      <CellGroup inset>
        <FormItem label='用户名' name='username' rules={[{ message: '8-16位且为字母、数字、下划线、减号', rule: /^[a-zA-Z0-9_-]{8,16}$/ }]}>
          <Input placeholder='用户名' style={{ width: '100%' }} />
        </FormItem>
        <FormItem
          label='密码'
          name='password'
          rules={[{ rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, message: '8-30位且字母、数字和特殊符号组合' }]}
        >
          <Input password placeholder='密码' style={{ width: '100%' }} />
        </FormItem>
        <FormItem label='图形码' className='captcha' name='captcha' required>
          <Input placeholder='请输入图形码' maxlength={5} />
          <Image src={props.image} onClick={props.getCaptcha} />
        </FormItem>
      </CellGroup>
    </Form>
  )
})

export default UserNameRegister
