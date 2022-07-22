/*
 * @Author: Derek Xu
 * @Date: 2022-07-22 17:41:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-22 18:21:45
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendarmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Container from '@/components/container'
import Pagination from '@/components/pagination'
import { useRecoilState, useRecoilValue } from 'recoil'
import { calendarStore, menuButtonStore } from '@/store'
import { IDavCalendar } from '~/../@types/calendar'
import { CalendarListBody } from './ui'

import './index.less'
import Header from '@/components/header'

export default Unite(
  {
    state: {
      list: null,
      complete: false
    },
    async onLoad() {
      //await this.loadList(true)
    },
    async loadList(refresh = false) {}
  },
  function ({ state, events, loading }) {
    const calendars = useRecoilValue(calendarStore)
    const { list, complete } = state
    const { loadList } = events

    useReachBottom(() => {
      console.log(999)
    })

    return (
      <Container
        navTitle='日程管理'
        enablePagePullDownRefresh={true}
        className='pages-calendar-manager-index'
        renderPageTopHeader={() => {
          return <Header title='日程管理' left to={4}></Header>
        }}
      >
        {calendars?.map((item: IDavCalendar, index: number) => {
          return (
            <View className='li' key={index}>
              <CalendarListBody item={item} editCalendar={() => alert(123)}></CalendarListBody>
            </View>
          )
        })}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
