/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-03-27 15:04:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:22:12
 */
import { FunctionComponent, useState } from 'react'
import { View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import { Button, Cell, CellGroup, Field } from '@antmjs/vantui'
import { checkPassword } from '@/calendar/utils'

interface IPageOption {
  disabled: boolean
  modifyPassword: (password: string) => void
}

const Password: FunctionComponent<IPageOption> = (props) => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const { show } = useToast({
    icon: 'error'
  })

  const modifyPassword = () => {
    if (!password || !checkPassword(password)) {
      show({
        title: '密码格式错误'
      })
      return
    }
    if (!confirmPassword) {
      show({
        title: '确认密码不能为空'
      })
      return
    }
    if (password !== confirmPassword) {
      show({
        title: '两次密码不一致'
      })
      return
    }
    props.modifyPassword(password)
  }

  return (
    <View className='box'>
      <View className='form'>
        <CellGroup inset>
          <Field label='密码' password placeholder='请输入密码' value={password} onChange={(e) => setPassword(e.detail)} />
          <Field label='确认密码' password placeholder='请输入确认密码' value={confirmPassword} onChange={(e) => setConfirmPassword(e.detail)} />
        </CellGroup>
        <CellGroup title='密码规则'>
          <Cell>至少为8位的字母、数字和特殊符号的组合</Cell>
        </CellGroup>
      </View>
      <View className='van-page-button'>
        <Button type='info' block onClick={modifyPassword} disabled={props.disabled}>
          保存
        </Button>
      </View>
    </View>
  )
}

export default Password
