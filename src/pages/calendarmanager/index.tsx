/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 17:41:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-15 09:39:23
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendarmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Router from 'tarojs-router-next'
import { Empty } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import { useRecoilState } from 'recoil'
import { calendarStore } from '@/store'
import { CalendarListBody } from './ui'
import { list } from '@/api/calendar'

import './index.less'
import { IDavCalendar } from 'types/calendar'

export default Unite(
  {
    state: {},

    async onLoad() {},

    async onReload() {
      list().then((res) => {
        this.hooks['setCalendarState'](res as any as IDavCalendar[])
      })
    },

    editCalendar(id: string) {
      if (!(this.hooks['calendars'] && this.hooks['calendars'].length > 0)) {
        return
      }
      const calendar: IDavCalendar | undefined = this.hooks['calendars'].find((item: IDavCalendar) => item.id === id)
      if (!calendar) return
      Router.toCalendaredit({
        data: calendar,
        params: {
          calendarId: calendar.id
        }
      })
    }
  },

  function ({ events }) {
    const { onReload, editCalendar } = events
    const [calendars, setCalendarState] = useRecoilState(calendarStore)

    events.setHooks({
      calendars: calendars,
      setCalendarState: setCalendarState
    })

    return (
      <Container
        navTitle='日程管理'
        enablePagePullDownRefresh={true}
        h5Nav={true}
        onReload={onReload}
        className='pages-calendar-manager-index'
        renderPageTopHeader={() => {
          return <Header title='日程管理' left to={4}></Header>
        }}
      >
        {calendars.length === 0 ? (
          <Empty description='~空空如也~' />
        ) : (
          <View className='list'>
            {calendars?.map((item: IDavCalendar, index: number) => {
              return (
                <View className='li' key={index}>
                  <CalendarListBody item={item} editCalendar={editCalendar}></CalendarListBody>
                </View>
              )
            })}
          </View>
        )}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
