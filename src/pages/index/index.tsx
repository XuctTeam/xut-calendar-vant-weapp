/* eslint-disable import/no-named-as-default-member */
/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-17 09:36:07
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import Unite from '@antmjs/unite'
import React, { useRef, useState } from 'react'
import { Button } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import { useRecoilState, useRecoilValue } from 'recoil'
import dayjs from 'dayjs'
import Images from '@/calendar/constants/images'
import { getToday } from '@/calendar/utils'
import Container from '@/components/container'
import calendar from '@/calendar'
import { IDavCalendar, ICalendarComponent, IDavComponent } from '~/../types/calendar'
import { ICurrentDay } from '~/../types/date'
import { UserInfo, EventList, Header, Calendar } from './ui'
import './index.module.less'
import { DayType } from '@/components/calendar/type'

const day: ICurrentDay = getToday()

export default Unite(
  {
    state: {
      popOpen: false,
      selectedDay: day.current,
      componentLoading: false,
      calendarComponents: [],
      marks: [],
      messageCount: 0
    },

    async onLoad() {
      // Taro.createSelectorQuery()
      //   .select('.at-calendar')
      //   .boundingClientRect(function (rect) {
      //     that.setState({
      //       animationShowHeight: rect.height + 4
      //     })
      //   })
      //   .exec()

      Taro.eventCenter.on('logout', () => {
        this.clear()
      })
    },

    async onShow() {},

    /**
     * 日历月份改变
     *
     * @param value
     */
    selectMonthChange(month: any) {
      console.log(month)
      // this._queryComponent(
      //   this.hooks['calendars'],
      //   dayjs(value).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      //   dayjs(value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      // )
    },

    /**
     * 日期长按住
     * @param item
     * @returns
     */
    selectDayLongClick(item: { value: string }): void {
      console.log(item.value)
    },

    selectDayClickHandler(info: DayType, dateFormate: string) {
      console.log(info)
      this.setState({
        selectedDay: dateFormate
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

    calendarSelected(value: string[]) {
      const _calendars = this.hooks['calendars'].map((t: IDavCalendar) => {
        const { id, name, color, major, display, memberId, calendarId, createMemberId, createMemberName, description, isShare, alarmTime, alarmType } = t
        const checked = value.includes(calendarId) ? true : false
        return {
          id,
          name,
          color,
          major,
          display,
          memberId,
          checked,
          calendarId,
          createMemberId,
          createMemberName,
          description,
          isShare,
          alarmTime,
          alarmType
        }
      })
      this.hooks['setCalendars'](_calendars)
    },

    /**
     * @description 日程查看
     */
    async viewComponent(component: IDavComponent) {
      console.log(component.id)
      Router.toComponentview({
        params: {
          id: component.id,
          from: '0'
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

      const pList: Array<Promise<any>> = []
      calList.forEach((item) => {
        pList.push(
          new Promise(function (resolve, reject) {
            calendar.$api.component
              .componentsDaysById(item.calendarId, start, end)
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
          this.setState({
            calendarComponents: calendarComponents,
            componentLoading: false
          })
          const now = dayjs().valueOf()
          this.hooks['localRefreshTimeRef'].current = now
          this.hooks['setComponentRefreshTime'](now)
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
      const marks: Array<CalendarTypes.Mark> = Array.from(daySet).map((i) => {
        return { value: i }
      })
      this.setState({
        marks: marks
      })
    },

    // setAnimationShowHeight(height: number) {
    //   this.setState({
    //     animationShowHeight: height
    //   })
    // },

    setMessageCount() {
      calendar.$api.message
        .count()
        .then((res) => {
          this.setState({
            messageCount: res as any as number
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    clear() {
      this.setState({
        marks: [],
        messageCount: 0
      })
      this.hooks['localRefreshTimeRef'].current = 0
    }
  },

  function ({ state, events }) {
    const { popOpen, selectedDay, marks, calendarComponents, messageCount } = state
    const {
      componentRefresh,
      selectMonthChange,
      currentClickHandle,
      calendarPopOpen,
      calendarPopClose,
      calendarSelected,
      viewComponent,
      setMessageCount,
      selectDayClickHandler
    } = events
    const env = calendar.$hooks.useWebEnv()
    const [calendars, setCalendars] = useRecoilState(calendar.$store.calendarStore)
    const userInfoState = useRecoilValue(calendar.$store.userInfoStore)
    const userAuths = useRecoilValue(calendar.$store.userAuthInfoStore)

    const accessToken = calendar.$cache.cacheGetSync('accessToken')
    const calRef = React.createRef()
    const localRefreshTimeRef = useRef<number>(0)
    const [componentRefreshTime, setComponentRefreshTime] = useRecoilState(calendar.$store.componentRefreshTimeStore)
    const { avatar, name } = userInfoState || { avatar: Images.DEFAULT_AVATAR, name: '' }
    const _useNav = calendar.$hooks.useNav()
    const phoneAuth =
      userAuths && userAuths.length > 0
        ? userAuths.find((i) => i.identityType === 'phone')
        : {
            memberId: (userInfoState && userInfoState.id) || '',
            username: '',
            nickName: '',
            avatar: '',
            identityType: 'phone'
          }

    events.setHooks({
      calRef: calRef,
      componentRefreshTime: componentRefreshTime,
      localRefreshTimeRef: localRefreshTimeRef,
      setComponentRefreshTime: setComponentRefreshTime,
      calendars: calendars,
      setCalendars: setCalendars
    })
    events.setHooks({ calendars: calendars })

    useDidShow(() => {
      if (!accessToken) return
      /** 增加刷新消息中心 */
      setMessageCount()
      if (localRefreshTimeRef.current !== 0 && componentRefreshTime !== 0 && localRefreshTimeRef.current >= componentRefreshTime) return
      componentRefresh()
    })

    return (
      <Container navTitle='日程管理' useNav={_useNav} className='pages-index-index' useMenuBtns={false} enablePagePullDownRefresh={false}>
        <Header selectedDay={selectedDay} calendarPopOpen={calendarPopOpen}></Header>
        <View className='box'>
          <Calendar selectedDay={selectedDay} onDayClick={selectDayClickHandler}></Calendar>
          <EventList
            loading={false}
            accessToken={accessToken || ''}
            wxBrower={false}
            today={day.current}
            view={'list'}
            selectedDay={selectedDay}
            calendars={calendars || []}
            calendarComponents={calendarComponents}
            viewComponent={viewComponent}
          ></EventList>
        </View>

        <UserInfo
          hasLogin={!!accessToken}
          open={popOpen}
          calendars={calendars && calendars instanceof Array ? calendars : []}
          closePopup={calendarPopClose}
          selected={calendarSelected}
          avatar={avatar}
          name={name}
          phone={phoneAuth?.username}
        ></UserInfo>

        {selectedDay !== day.current && (
          <View className='pages-index_today-icon' style={{ bottom: env ? '80px' : '10px' }} onClick={currentClickHandle}>
            今
          </View>
        )}

        <View className='pages-index_home-fab' style={{ bottom: env ? '80px' : '20px' }} onClick={() => Router.toComponentedit()}>
          {!!accessToken && <Button icon='plus' round type='warning' />}
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
