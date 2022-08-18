/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-31 02:24:12
 * @LastEditTime: 2022-08-18 10:56:17
 * @LastEditors: Derek Xu
 */
import React from 'react'
import dayjs from 'dayjs'
import { RadioGroup, Cell, CellGroup, Radio } from '@antmjs/vantui'

interface IPageOption {
  selectedDate: Date
  selectedMonthDay: string
  monthDaySelected: (name: string) => void
}

const Monthly: React.FC<IPageOption> = (props) => {
  return (
    <RadioGroup value={props.selectedMonthDay} onChange={(e) => props.monthDaySelected(e.detail)}>
      <CellGroup>
        <Cell title={`每月` + dayjs(props.selectedDate).format('（DD日）')}>
          <Radio name='1' />
        </Cell>
        <Cell title={`每月` + '（第' + Math.ceil(props.selectedDate.getDate() / 7) + '个' + dayjs(props.selectedDate).format('ddd') + '）'}>
          <Radio name='2' />
        </Cell>
      </CellGroup>
    </RadioGroup>
  )
}

export default Monthly
