/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 17:41:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-29 16:14:55
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendarmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Empty, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import { useRecoilValue } from 'recoil'
import { calendarStore } from '@/store'
import { IDavCalendar } from '~/../@types/calendar'
import { CalendarListBody } from './ui'
import classnames from 'classnames'
import { brower } from '@/utils'

import './index.less'
import Router from 'tarojs-router-next'

export default Unite(
  {
    state: {},

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
    const calendars = useRecoilValue(calendarStore)
    const { editCalendar } = events
    events.setHooks({
      calendars: calendars
    })

    return (
      <Container
        navTitle='日程管理'
        enablePagePullDownRefresh={false}
        h5Nav={true}
        className={classnames('pages-calendar-manager-index', {
          ['van-page-box']: brower()
        })}
        renderPageTopHeader={() => {
          return <Header title='日程管理' left to={4}></Header>
        }}
      >
        {!calendars && <Empty description='暂无数据' />}
        {calendars && calendars.length !== 0 && (
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
