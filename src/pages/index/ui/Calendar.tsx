/*
 * @Description:首页日历
 * @Author: Derek Xu
 * @Date: 2021-10-26 12:54:02
 * @LastEditTime: 2022-07-15 21:50:18
 * @LastEditors: Derek Xu
 */
import { forwardRef } from 'react'
import CalendarTypes from '@/components/calendar/types/calendar'
import AtCalendar from '@/components/calendar'

type IPageOption = {
  ref: any
  isLunar: boolean
  isMonfirst: boolean
  currentDay: string
  marks: Array<CalendarTypes.Mark>
  selectDayClick: (item: { value: CalendarTypes.SelectedDate }) => void
  selectMonthChage: (value: string) => void
  selectDayLongClick: (item: { value: string }) => void
}

const CalendarRef: React.FC<IPageOption> = forwardRef((props, ref: any) => (
  <AtCalendar
    ref={ref}
    currentDate={props.currentDay}
    marks={props.marks}
    isSwiper={false}
    isLunar={props.isLunar}
    isMonfirst={props.isMonfirst}
    onSelectDate={props.selectDayClick}
    onMonthChange={props.selectMonthChage}
    onDayLongClick={props.selectDayLongClick}
  ></AtCalendar>
))

export default CalendarRef
