/*
 * @Author: Derek Xu
 * @Date: 2022-08-17 11:14:03
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 12:30:01
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\ui\Picker.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { DatetimePicker, Popup } from '@antmjs/vantui'
import { ITouchEvent } from '@tarojs/components'
import dayjs from 'dayjs'

interface IPageOption {
  show: boolean
  selectedDay: Date
  fullDay: number
  onSelected: (e: ITouchEvent) => void
  onClose: () => void
}

const Picker: FC<IPageOption> = (props) => {
  const { show, selectedDay, fullDay } = props
  const maxDay = dayjs(selectedDay).add(3, 'year').valueOf()
  const minDay = dayjs(selectedDay).add(-3, 'year').valueOf()

  return (
    <Popup show={show} position='bottom' onClose={props.onClose}>
      {fullDay === 1 ? (
        <DatetimePicker
          onCancel={props.onClose}
          type='date'
          maxDate={maxDay}
          minDate={minDay}
          value={selectedDay}
          onConfirm={props.onSelected}
          filter={(type, options) => {
            if (type === 'minute') {
              return options.filter((option: any) => option % 5 === 0)
            }
            return options
          }}
        />
      ) : (
        <DatetimePicker
          onCancel={props.onClose}
          type='datetime'
          maxDate={maxDay}
          minDate={minDay}
          value={selectedDay}
          onConfirm={props.onSelected}
          filter={(type, options) => {
            if (type === 'minute') {
              return options.filter((option: any) => option % 5 === 0)
            }
            return options
          }}
        />
      )}
    </Popup>
  )
}

export default Picker
