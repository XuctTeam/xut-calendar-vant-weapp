/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-10-27 17:12:27
 * @LastEditTime: 2022-07-20 09:20:19
 * @LastEditors: Derek Xu
 */
import { FunctionComponent, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Empty } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { IDavCalendar, ICalendarComponent, IDavComponent } from '~/../@types/calendar'
import { ListEventView, DayEventView } from '../component'

type IPageOption = {
  loading: boolean
  view: number
  today: string
  accessToken: string
  selectedDay: string
  wxBrower: boolean
  calendars: Array<IDavCalendar>
  calendarComponents: Array<ICalendarComponent>
  viewComponent: (component: IDavComponent) => void
}

interface ISelectCalendar {
  name: string
  color: string
  checked: boolean
}

const currentTime = dayjs().valueOf()

const EventList: FunctionComponent<IPageOption> = (props) => {
  const [componentList, setComponentList] = useState<IDavComponent[]>([])

  useEffect(() => {
    if (!props.accessToken) {
      setComponentList([])
      return
    }
    if (!props.calendars || props.calendars.length === 0) {
      setComponentList([])
      return
    }
    const map: Map<string, ISelectCalendar> = new Map<string, ISelectCalendar>()
    props.calendars
      .filter((c) => c.display === 1)
      .forEach((c) => {
        map.set(c.calendarId, { name: c.name, color: c.color, checked: c.checked ? true : false })
      })
    let cps: Array<IDavComponent> = []
    if (props.calendarComponents && props.calendarComponents.length !== 0) {
      props.calendarComponents.forEach((c) => {
        if (!c.components) return
        const selectedCalendar: ISelectCalendar | undefined = map.get(c.calendarId)
        if (selectedCalendar == null) return
        if (selectedCalendar.checked && dayjs(props.selectedDay).isSame(dayjs(c.day), 'day')) {
          cps = cps.concat(
            c.components.map((item) => {
              return { ...item, color: selectedCalendar.color, calendarName: selectedCalendar.name }
            })
          )
        }
      })
    }
    cps.sort((n1, n2) => {
      return dayjs(n1.dtstart).unix() - dayjs(n2.dtstart).unix()
    })
    setComponentList(cps)
  }, [props.accessToken, props.selectedDay, props.calendars, props.calendarComponents])

  return (
    <View className='vi-index-wrapper_event'>
      {componentList.length == 0 ? (
        <Empty description='~暂无数据~' />
      ) : (
        <View>
          {props.view === 0 ? (
            <DayEventView
              selectedDay={props.selectedDay}
              viewComponent={props.viewComponent}
              currentTime={currentTime}
              today={props.today}
              componentList={componentList}
            ></DayEventView>
          ) : (
            <ListEventView
              selectedDay={props.selectedDay}
              viewComponent={props.viewComponent}
              currentTime={currentTime}
              today={props.today}
              componentList={componentList}
            ></ListEventView>
          )}
        </View>
      )}
    </View>
  )
}

export default EventList
