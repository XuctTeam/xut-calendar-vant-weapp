/*
 * @Author: Derek Xu
 * @Date: 2023-10-16 17:59:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-25 17:51:34
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Calendar.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import calendar from '@/calendar'
import Calendar from '@/components/calendar/calendar'
import CalendarComponent from '@/components/calendar'

interface IProps {
  selectedDay: string
  onSelectDate?: (item: { value: Calendar.SelectedDate }) => void
}

const Index: FC<IProps> = ({ selectedDay, onSelectDate }) => {
  const lunar = useRecoilValue(calendar.$store.lunarStore)
  const monday = useRecoilValue(calendar.$store.mondayStore)
  const view = useRecoilValue(calendar.$store.compViewStore)

  return (
    <CalendarComponent
      monday={monday}
      lunar={lunar}
      view={view === 'week' ? 'week' : 'month'}
      currentDate={selectedDay}
      onSelectDate={onSelectDate}
    ></CalendarComponent>
  )
}

export default Index
