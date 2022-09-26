/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-14 17:31:01
 * @LastEditTime: 2022-09-26 16:39:58
 * @LastEditors: Derek Xu
 */
import { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Button } from '@antmjs/vantui'
import './index.less'

export type ButtonOption = {
  name: string
  value: number
}

interface IButtonGroupOption {
  actived: number
  buttons: ButtonOption[]
  onClick: (opt: number) => void
}

const ButtonGroup: FunctionComponent<IButtonGroupOption> = (props) => {
  const click = (index: number) => {
    const _index = props.buttons[index]
    if (!_index) return
    props.onClick(_index.value)
  }

  return (
    <View className='van-group-button'>
      {props.buttons.map((item, index) => {
        return (
          <Fragment key={index}>
            {index === props.actived ? (
              <Button type='warning' plain hairline onClick={() => click(index)}>
                {item.name}
              </Button>
            ) : (
              <Button type='warning' hairline onClick={() => click(index)}>
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
