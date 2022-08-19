/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-28 19:24:31
 * @LastEditTime: 2022-08-18 10:53:18
 * @LastEditors: Derek Xu
 */
import { Picker, Popup } from '@antmjs/vantui'
import React from 'react'

interface IPageOption {
  open: boolean
  type: string
  repeatInterval: number
  onSelected: (values: number | number[]) => void
  onClose: () => void
}

const IntervalPicker: React.FC<IPageOption> = (props) => {
  const columns = Array.from({ length: 100 }, (v, k) => k)
    .splice(1)
    .map((i) => {
      return i
    })

  return (
    <Popup show={props.open} position='bottom' onClose={props.onClose}>
      <Picker
        showToolbar
        columns={columns}
        onCancel={props.onClose}
        onConfirm={(e) => {
          props.onSelected(e.detail.value)
        }}
      ></Picker>
    </Popup>
  )
}

export default IntervalPicker
