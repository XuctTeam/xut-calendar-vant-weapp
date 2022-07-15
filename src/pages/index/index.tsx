/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-15 20:02:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import React from 'react'
import { Button, Icon, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import { View } from '@tarojs/components'
import { useRecoilState } from 'recoil'
import { Collapse, CollapseItem } from '@antmjs/vantui'
import Header from '@/components/header'
import dayjs from 'dayjs'
import { ICurrentDay } from '~/../@types/date'
import { getToday } from '@/utils'
import { componentRefreshTimeStore } from '@/store'
import { IDavCalendar, ICalendarComponent, IDavComponent, IDvaCalendarProps, IDvaComponentProps } from '~/../@types/calendar'
import CalendarTypes from '@/components/calendar/types/calendar'
import { Picker } from './ui'
import { componentsDaysById } from '@/api/component'

import './index.less'

const day: ICurrentDay = getToday()

export default Unite(
  {
    state: {
      collapse: ['1'],
      selectedDay: day.current,
      componentLoading: false,
      calendarComponents: [],
      componentRefreshLocalTime: 0,
      marks: []
    },

    async onLoad() {
      // const datap = await petClient.addPet({
      //   body: { name: 'xx', photoUrls: ['xxx'] },
      // })
    },

    /**
     * 日历月份改变
     *
     * @param value
     */
    selectMonthChage(value: string) {
      this._queryComponent(calendars, dayjs(value).startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs(value).endOf('month').format('YYYY-MM-DD HH:mm:ss'))
    },

    /**
     * 日期长按住
     * @param item
     * @returns
     */
    selectDayLongClick(item: { value: string }): void {
      console.log(item.value)
    },

    selectDayClickHadnle(item: { value: CalendarTypes.SelectedDate }) {
      this.setState({
        selectedDay: item.value.start.toString()
      })
    },

    /**
     * @description 日程列表刷新
     */
    componentRefresh() {
      this._queryComponent(
        calendars,
        dayjs(this.state.selectedDay).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(this.state.selectedDay).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      )
    },

    collapseChage(value: any) {
      this.setState({
        collapse: value
      })
    },

    /**
     * @description 查询日历下所有日程
     *
     * @param calList
     * @param start
     * @param end
     */
    _queryComponent(calList: Array<IDavCalendar> | unknown, start: string, end: string) {
      if (!calList || !(calList instanceof Array)) return
      this.setState({
        componentLoading: true,
        calendarComponents: [],
        marks: []
      })

      let pList: Array<Promise<any>> = []
      calList.forEach((calendar) => {
        pList.push(
          new Promise(function (resolve, reject) {
            componentsDaysById(calendar.calendarId, start, end)
              .then((res: any) => {
                resolve(res)
              })
              .catch((err: any) => {
                reject(err)
              })
          })
        )
      })
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let calendarComponents: Array<ICalendarComponent> = []
      Promise.all(
        pList.map((p) => {
          return p.catch((error) => error)
        })
      )
        .then((res) => {
          if (!(res instanceof Array)) return
          res.forEach((i) => (calendarComponents = calendarComponents.concat(i)))
          this._fillMarkDay(calendarComponents)
          const now: number = dayjs().unix()
          this.setState({
            calendarComponents: calendarComponents,
            componentLoading: false,
            componentRefreshLocalTime: now
          })
        })
        .catch((error) => {
          console.log(error, 'error')
          this.setState({
            componentLoading: false
          })
        })
    },

    /**
     * @description 补充日历上有日程的天
     *
     * @param components
     * @returns
     */
    _fillMarkDay(components: Array<ICalendarComponent>) {
      if (components.length === 0) return
      const daySet: Set<string> = new Set<string>([])
      components.forEach((comp) => {
        daySet.add(dayjs(comp.day).format('YYYY/MM/DD'))
      })
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const marks: Array<CalendarTypes.Mark> = Array.from(daySet).map((i) => {
        return { value: i }
      })
      this.setState({
        marks: marks
      })
    }
  },

  function ({ state, events }) {
    const { collapse } = state
    const { selectMonthChage, selectDayLongClick, selectDayClickHadnle, collapseChage } = events

    const calRef = React.createRef()
    const lunar = true
    const monday = true

    return (
      <Container
        navTitle='日程管理'
        className='pages-index-index'
        enablePagePullDownRefresh={true}
        renderPageTopHeader={() => {
          return <Header title='日程管理' left={false} to={1}></Header>
        }}
      >
        <Collapse value={collapse} onChange={collapseChage}>
          <CollapseItem
            name='1'
            renderTitle={
              <Icon
                classPrefix='page-icon'
                name='rili'
                size={50}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  console.log(22222222222)
                }}
              ></Icon>
            }
          >
            <Picker
              ref={calRef}
              currentDay={dayjs(state.selectedDay).format('YYYY/MM/DD')}
              marks={state.marks}
              isLunar={!!lunar}
              isMonfirst={!!monday}
              selectMonthChage={selectMonthChage}
              selectDayLongClick={selectDayLongClick}
              selectDayClick={selectDayClickHadnle}
            ></Picker>
          </CollapseItem>
          <CollapseItem title='有赞微商城' name='2'>
            sdfsdf
          </CollapseItem>
        </Collapse>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
