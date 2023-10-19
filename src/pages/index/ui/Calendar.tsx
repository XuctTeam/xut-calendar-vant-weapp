/*
 * @Author: Derek Xu
 * @Date: 2023-10-16 17:59:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 09:42:48
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Calendar.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { FC, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import CustomCalendar from '@/components/calendar'
import calendar from '@/calendar'
import { DayType } from '@/components/calendar/type'

interface IProps {
  selectedDay: string
  onDayClick: (info: DayType, dateFormate: string) => void
}

const Index: FC<IProps> = ({ selectedDay, onDayClick }) => {
  const lunar = useRecoilValue(calendar.$store.lunarStore)
  const monday = useRecoilValue(calendar.$store.mondayStore)
  const view = useRecoilValue(calendar.$store.compViewStore)

  return (
    <CustomCalendar
      mode={lunar}
      view={view === 'week' ? 'week' : 'month'}
      selectedDate={selectedDay}
      startWeekDay={monday ? 1 : 0}
      onDayClick={onDayClick}
    ></CustomCalendar>
  )
}

export default Index
