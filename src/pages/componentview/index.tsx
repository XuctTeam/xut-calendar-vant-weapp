/*
 * @Author: Derek Xu
 * @Date: 2022-09-23 13:46:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-23 15:28:06
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Container from '@/components/container'
import './index.less'
import Header from '@/components/header'
import { View } from '@tarojs/components'
import { Cell } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { DifferentDay, SameDay } from './ui'
import { formatAlarmText } from '@/utils'

export default Unite(
  {
    state: {
      color: '',
      summary: '',
      calendarName: '',
      dtstart: dayjs().toDate(),
      dtend: dayjs().toDate(),
      fullDay: 0,
      repeatStatus: '',
      repeatType: '',
      repeatByday: '',
      repeatBymonth: '',
      repeatBymonthday: '',
      repeatInterval: 0,
      repeatUntil: '',
      memberIds: [],
      alarmType: '',
      alarmTimes: [],
      attendStatus: 0
    },
    loaded: false,
    async onLoad() {
      const { id, add } = this.location.params
      debugger
    }
  },
  function ({ state, events }) {
    const {
      color,
      summary,
      calendarName,
      dtstart,
      dtend,
      fullDay,
      repeatStatus,
      repeatType,
      repeatByday,
      repeatBymonth,
      repeatBymonthday,
      repeatInterval,
      repeatUntil,
      memberIds,
      alarmType,
      alarmTimes
    } = state
    return (
      <Container
        navTitle='日程查看'
        enablePagePullDownRefresh={true}
        className='pages-component-view-index'
        renderPageTopHeader={() => {
          return <Header title='日程查看' left={true} to={1}></Header>
        }}
      >
        <View className='cell-item summary-calendar-more taroify-hairline--bottom'>
          <View className='event-label' style={{ color: `#${color}`, background: `#${color}` }}></View>
          <View className='event-content'>
            <View className='summary-calendar'>
              <View className='summary'>{summary}</View>
              <View className='calendar-source'>
                <View className='calendar'>{calendarName}</View>
              </View>
            </View>
            {/* {userInfo && userInfo.id === component.creatorMemberId && (
              <Fragment>
                <Ellipsis onClick={() => setOpen(true)}></Ellipsis>
              </Fragment>
            )} */}
          </View>
        </View>
        <View className='cell-item  taroify-hairline--bottom'>
          <View className='event-content event-content-padding-top'>
            {dayjs(dtstart).isSame(dtend, 'date') ? (
              <SameDay dtstart={dtstart} dtend={dtend} fullDay={fullDay}></SameDay>
            ) : (
              <DifferentDay
                dtstart={dtstart}
                dtend={dtend}
                fullDay={fullDay}
                repeatStatus={repeatStatus}
                repeatType={repeatType}
                repeatByday={repeatByday}
                repeatBymonth={repeatBymonth}
                repeatBymonthday={repeatBymonthday}
                repeatInterval={repeatInterval}
              ></DifferentDay>
            )}
          </View>
        </View>
        {memberIds && memberIds.length !== 0 && (
          <>
            <Cell size='large' className='attend' title='组织者'></Cell>
            <Cell className='attend' title={`共邀请（${memberIds.length}）人`} clickable size='large'></Cell>
          </>
        )}
        <View className='divider'></View>
        <View className='cell-item taroify-hairline--bottom'>
          <View className='event-content event-content-padding-top'>{formatAlarmText(alarmType, alarmTimes)}</View>
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
