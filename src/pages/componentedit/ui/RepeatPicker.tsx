/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-28 09:13:40
 * @LastEditTime: 2022-08-18 21:12:42
 * @LastEditors: Derek Xu
 */
import { DatetimePicker, Popup } from '@antmjs/vantui'
import { DatetimePickerEventsByValue } from '@antmjs/vantui/types/datetime-picker'
import React, { useState } from 'react'

interface IPageOption {
  selectedDate: Date | null
  show: boolean
  minDate: Date
  onClose: () => void
  onConfirm: (value: number | string) => void
}

const RepeatPicker: React.FC<IPageOption> = (props) => {
  const { show, minDate, selectedDate } = props
  const [defaultValue] = useState(new Date())

  return (
    <Popup position='bottom' show={show} onClose={props.onClose}>
      <DatetimePicker
        value={selectedDate || defaultValue}
        showToolbar
        onCancel={props.onClose}
        onConfirm={(e: DatetimePickerEventsByValue) => props.onConfirm(e.detail.value || 0)}
        type='date'
        minDate={minDate.getTime()}
        formatter={(type, val) => {
          if (type === 'year') {
            return val + '年'
          }
          if (type === 'month') {
            return val + '月'
          }
          if (type === 'day') {
            return val + '日'
          }
          return val
        }}
      ></DatetimePicker>
    </Popup>
  )
}

export default RepeatPicker
