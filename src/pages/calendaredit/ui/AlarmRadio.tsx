/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-01-31 15:58:16
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-28 16:55:59
 */
import { FunctionComponent } from 'react'
import { alarmTimeTypes, alarmTypes } from '@/calendar/constants/index'
import { Radio, RadioGroup } from '@antmjs/vantui'
import { ITouchEvent } from '@tarojs/components'

interface IPageOption {
  type: 'alarmTime' | 'alarmType'
  defaultValue: string
  disable?: boolean
  onChange: (event: ITouchEvent) => void
}

const AlarmRadio: FunctionComponent<IPageOption> = (props) => {
  return (
    <RadioGroup value={props.defaultValue} direction='horizontal' disabled={props.disable} onChange={props.onChange}>
      {props.type === 'alarmTime'
        ? alarmTimeTypes.map((item, i) => {
            return (
              <Radio key={i} name={item.value}>
                {item.text}
              </Radio>
            )
          })
        : alarmTypes.map((item, i) => {
            return (
              <Radio key={i} name={item.value}>
                {item.text}
              </Radio>
            )
          })}
    </RadioGroup>
  )
}
export default AlarmRadio
