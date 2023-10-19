/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 17:41:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:26:33
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendarmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Router from 'tarojs-router-next'
import { Empty, InfiniteScroll } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useRecoilState } from 'recoil'
import Container from '@/components/container'
import { calendarStore } from '@/calendar/store/store'
import calendar from '@/calendar'
import { Calendar } from '@/calendar/api/interface'
import { CalendarListBody } from './ui'

import './index.less'

export default Unite(
  {
    state: {
      loading: false
    },

    async onReload() {
      this.setState({
        loading: true
      })
      calendar.$api.calendar
        .list()
        .then((res) => {
          this.setState({
            loading: false
          })
          this.hooks['setCalendarState'](res.data)
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    editCalendar(id: string) {
      if (!(this.hooks['calendars'] && this.hooks['calendars'].length > 0)) {
        return
      }
      const calendar: Calendar.IDavCalendar | undefined = this.hooks['calendars'].find((item: Calendar.IDavCalendar) => item.id === id)
      if (!calendar) return
      Router.toCalendaredit({
        data: calendar,
        params: {
          calendarId: calendar.id
        }
      })
    },

    async loadMore(): Promise<any> {
      return new Promise(async (resolve) => {
        resolve('complete')
      })
    }
  },

  function ({ events }) {
    const { editCalendar, loadMore } = events
    const [calendars, setCalendarState] = useRecoilState(calendarStore)
    const usedNav = calendar.$hooks.useNav()

    events.setHooks({
      calendars: calendars,
      setCalendarState: setCalendarState
    })

    return (
      <Container navTitle='日程管理' enablePagePullDownRefresh={false} className='pages-calendar-manager-index' useNav={usedNav} useMenuBtns={usedNav}>
        {calendars.length === 0 ? (
          <Empty description='~空空如也~' />
        ) : (
          <View className='list'>
            <InfiniteScroll className='scroll' loadMore={loadMore} style={{ height: '100%' }}>
              {calendars?.map((item: Calendar.IDavCalendar, index: number) => {
                return (
                  <View className='li' key={index}>
                    <CalendarListBody item={item} editCalendar={editCalendar}></CalendarListBody>
                  </View>
                )
              })}
            </InfiniteScroll>
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
