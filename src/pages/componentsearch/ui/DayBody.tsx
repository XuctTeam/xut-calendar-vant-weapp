/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-24 15:26:05
 * @LastEditTime: 2022-11-14 15:07:53
 * @LastEditors: Derek Xu
 */
import React from 'react'
import dayjs from 'dayjs'
import ComponentBody from './ComponentBody'
import { IDavComponent } from 'types/calendar'
import { formatWeek } from '@/calendar/utils'
import { CellGroup } from '@antmjs/vantui'

interface IPageOption {
  day: string
  components: Array<IDavComponent>
  viewComponent: (id: string) => void
}

const DayBody: React.FC<IPageOption> = (props) => {
  const formatDay = (): string => {
    return dayjs(props.day).format('MM-DD') + ' ' + formatWeek(dayjs(props.day).get('day'))
  }

  return (
    <CellGroup title={formatDay()}>
      {props.components.map((item) => {
        return <ComponentBody key={item.id} component={item} viewComponent={props.viewComponent}></ComponentBody>
      })}
    </CellGroup>
  )
}

export default DayBody
