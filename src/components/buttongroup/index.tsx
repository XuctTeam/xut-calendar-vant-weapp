/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-14 17:31:01
 * @LastEditTime: 2023-10-16 16:36:15
 * @LastEditors: Derek Xu
 */
import { Fragment, FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@antmjs/vantui'
import './index.less'

export type ButtonOption = {
  name: string
  value: number
}

interface IButtonGroupOption {
  active: number
  buttons: ButtonOption[]
  size?: 'small' | 'normal' | 'large' | 'mini'
  type?: 'default' | 'primary' | 'info' | 'warning' | 'danger'
  onClick: (opt: number) => void
}

const ButtonGroup: FunctionComponent<IButtonGroupOption> = ({ active, buttons, size = 'normal', type = 'warning', onClick }) => {
  const click = (index: number) => {
    const _index = buttons[index]
    if (!_index) return
    onClick && onClick(_index.value)
  }

  return (
    <View className='van-group-button'>
      {buttons.map((item, index) => {
        return (
          <Fragment key={index}>
            {item.value !== active ? (
              <Button type={type} size={size} plain hairline onClick={() => click(index)}>
                {item.name}
              </Button>
            ) : (
              <Button type={type} size={size} hairline onClick={() => click(index)}>
                {item.name}
              </Button>
            )}
          </Fragment>
        )
      })}
    </View>
  )
}

export default ButtonGroup
