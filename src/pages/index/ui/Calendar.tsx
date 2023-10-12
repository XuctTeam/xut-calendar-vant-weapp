/* eslint-disable import/no-named-as-default-member */
/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-12 15:57:55
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Calendar.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { FunctionComponent, useState, CSSProperties } from 'react'
import Calendar from '@/components/calendar'
import styles from '../index.module.less'

interface IProps {
  isLunar: boolean
  isMonday: boolean
}

const Index: FunctionComponent<IProps> = ({ isLunar, isMonday }) => {
  const [calendarObj, setCalendarObj] = useState<Calendar>()
  const [currentView, setCurrentView] = useState('2023-10-11')
  const [selected, setSelected] = useState('2023-10-11')
  const [isWeekView, setIsWeekView] = useState(false)

  return (
    <>
      <Calendar
        marks={[
          { value: '2023-10-11', color: 'gray', markSize: '9px' },
          { value: '2019-08-12', color: 'pink', markSize: '9px' },
          { value: '2019-08-13', color: 'gray', markSize: '9px' },
          { value: '2019-08-14', color: 'yellow', markSize: '9px' },
          { value: '2019-08-15', color: 'darkblue', markSize: '9px' },
          { value: '2019-08-16', color: 'pink', markSize: '9px' },
          { value: '2019-08-17', color: 'green', markSize: '9px' }
        ]}
        customStyleGenerator={(params) => {
          return {
            markStyle: {}
          }
        }}
        extraInfo={[
          { value: '2023-10-21', text: '生日', color: 'red' },
          { value: '2023-10-22', text: '休假', color: 'darkblue' },
          { value: '2019-08-23', text: '会议', color: 'gray' }
        ]}
        view={isWeekView ? 'week' : 'month'}
        mode={isLunar ? 'lunar' : 'normal'}
        bindRef={(ref) => {
          setCalendarObj(ref)
        }}
        selectedDateColor={'#0088FF'}
        currentView={currentView}
        onCurrentViewChange={setCurrentView}
        startDay={isMonday ? 1 : 0}
        selectedDate={selected}
        onDayClick={(item) => setSelected(item.value)}
      />
    </>
  )
}

export default Index
