/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 17:41:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-29 21:43:31
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
    state: {
      loading: false
    },

    async onLoad() {},

    async onReload() {
      this.setState({
        loading: true
      })
      list()
        .then((res) => {
          this.setState({
            loading: false
          })
          this.hooks['setCalendarState'](res as any as IDavCalendar[])
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

  function ({ state, events }) {
    const { loading } = state
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
        loading={loading}
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
