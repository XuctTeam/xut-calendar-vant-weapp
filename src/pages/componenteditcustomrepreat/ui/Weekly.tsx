/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-30 11:18:24
 * @LastEditTime: 2022-08-18 10:57:04
 * @LastEditors: Derek Xu
 */
import React from 'react'
import { formatWeek } from '@/calendar/utils'
import { Cell, CellGroup, Checkbox, CheckboxGroup } from '@antmjs/vantui'

interface IPageOption {
  defaultValues: Array<string>
  weekSelected: (weeks: Array<string>) => void
}

const Weekly: React.FC<IPageOption> = (props) => {
  return (
    <CheckboxGroup value={props.defaultValues} onChange={(e) => props.weekSelected(e.detail)}>
      <CellGroup>
        {Array.from([1, 2, 3, 4, 5, 6, 0], (k) => k).map((i) => {
          return (
            <Cell key={i} title={formatWeek(i)}>
              <Checkbox shape='square' name={`${i}`} />
            </Cell>
          )
        })}
      </CellGroup>
      <></>
    </CheckboxGroup>
  )
}

export default Weekly
