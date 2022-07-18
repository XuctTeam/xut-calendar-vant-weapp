/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-18 15:09:37
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import React from 'react'
import { Button, Icon, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import { View } from '@tarojs/components'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { Collapse, CollapseItem } from '@antmjs/vantui'
import Header from '@/components/header'
import dayjs from 'dayjs'
import { ICurrentDay } from '~/../@types/date'
import { getToday } from '@/utils'
import { calendarState, componentRefreshTimeStore } from '@/store'
import { cacheGetSync } from '@/cache'
import { IDavCalendar, ICalendarComponent, IDavComponent, IDvaCalendarProps, IDvaComponentProps } from '~/../@types/calendar'
import CalendarTypes from '@/components/calendar/types/calendar'
import { Calendar, CalendarPop, EventList } from './ui'
import { componentsDaysById } from '@/api/component'

import './index.less'
import { useWebEnv } from '@/hooks'
import Router from 'tarojs-router-next'

const day: ICurrentDay = getToday()

export default Unite(
  {
    state: {
      collapse: ['1'],
      popOpen: false,
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
      console.log(this.hooks)
      this._queryComponent(
        this.hooks['calendars'],
        dayjs(value).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      )
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
        this.hooks['calendars'],
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
     * 今日图标点击
     */
    currentClickHandle() {
      const today: string = day.current
      //@ts-ignore
      this.hooks['calRef'].current.reset(today)
      this.setState({
        selectedDay: today
      })
    },

    /**
     * 日历选择点击
     */
    calendarPopOpen() {
      this.setState({
        popOpen: true
      })
    },
    /**
     * 日历选择关闭
     */
    calendarPopClose() {
      this.setState({
        popOpen: false
      })
    },

    calendarSelected() {},

    /**
     * @description 日程查看
     */
    async viewComponent(component: IDavComponent) {
      Router.toComponentview({
        params: {
          componentId: component.id,
          add: false
        },
        data: {
          component: component
        }
      })
    },

    /**
     * @description 查询日历下所有日程
     *
     * @param calList
     * @param start
     * @param end
     */
    _queryComponent(calList: Array<IDavCalendar>, start: string, end: string) {
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
      let calendarComponents: Array<ICalendarComponent> = []
      Promise.all(
        pList.map((p) => {
          return p.catch((error) => error)
        })
      )
        .then((res) => {
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
    const { popOpen, collapse, selectedDay, marks, calendarComponents } = state
    const {
      selectMonthChage,
      selectDayLongClick,
      selectDayClickHadnle,
      collapseChage,
      currentClickHandle,
      calendarPopOpen,
      calendarPopClose,
      calendarSelected,
      viewComponent
    } = events
    const env = useWebEnv()
    const calendars = useRecoilValue(calendarState)
    const accessToken = cacheGetSync('accessToken')
    const [componentRefreshTime, setComponentRefreshTime] = useRecoilState(componentRefreshTimeStore)
    const calRef = React.createRef()

    events.setHooks({
      calRef: calRef,
      setComponentRefresh: setComponentRefreshTime,
      calendars: calendars,
      componentRefresh: componentRefreshTime
    })
    events.setHooks({ calendars: calendars })

    const lunar = true
    const monday = true
    const view = '1'

    return (
      <Container
        navTitle='日程管理'
        className='pages-index-index'
        enablePagePullDownRefresh={true}
        renderPageTopHeader={() => {
          return <Header title='日程管理' left={false} to={1}></Header>
        }}
      >
        <Collapse value={collapse} onChange={(e) => collapseChage(e.detail)}>
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
                  calendarPopOpen()
                }}
              ></Icon>
            }
          >
            <Calendar
              ref={calRef}
              currentDay={dayjs(selectedDay).format('YYYY/MM/DD')}
              marks={marks}
              isLunar={!!lunar}
              isMonfirst={!!monday}
              selectMonthChage={selectMonthChage}
              selectDayLongClick={selectDayLongClick}
              selectDayClick={selectDayClickHadnle}
            ></Calendar>
          </CollapseItem>
          <CollapseItem title='有赞微商城' name='2'></CollapseItem>
        </Collapse>

        <EventList
          loading={false}
          accessToken={accessToken || ''}
          wxBrower={false}
          today={day.current}
          view={view && view + '' === '1' ? 1 : 0}
          selectedDay={selectedDay}
          calendars={calendars}
          calendarComponents={calendarComponents}
          viewComponent={viewComponent}
        ></EventList>

        <CalendarPop
          hasLogin={!!accessToken}
          open={popOpen}
          calendars={calendars && calendars instanceof Array ? calendars : []}
          closePopup={calendarPopClose}
          selected={calendarSelected}
        ></CalendarPop>

        {selectedDay !== day.current && (
          <View className='pages-index_today-icon' style={{ bottom: env ? '70px' : '10px' }} onClick={currentClickHandle}>
            今
          </View>
        )}

        <View className='pages-index_home-fab' style={{ bottom: env ? '80px' : '20px' }}>
          {!!accessToken && <Button size='small' color='primary' />}
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
