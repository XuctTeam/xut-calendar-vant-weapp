/*
 * @Author: Derek Xu
 * @Date: 2022-11-08 13:08:13
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-08 17:02:43
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentshareview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Container from '@/components/container'
import { View } from '@tarojs/components'
import { DifferentDay, SameDay } from './ui'
import { useNav } from '@/utils'
import dayjs from 'dayjs'
import { Button, Cell, Tag } from '@antmjs/vantui'
import { getShareInfo } from '@/api/component'
import { IDavComponent } from 'types/calendar'
import { cacheGetSync } from '@/cache'
import { useRecoilValue } from 'recoil'
import { userInfoStore } from '@/store'
import './index.less'
import Router from 'tarojs-router-next'

interface IShareComponent extends IDavComponent {
  attend: boolean
  createMemberName: string
}

export default Unite(
  {
    state: {
      loading: true,
      id: '',
      color: '',
      summary: '',
      calendarName: '',
      location: '',
      creatorMemberId: '',
      description: '',
      createMemberName: '',
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
      attend: false
    },

    async onLoad() {
      const { id } = this.location.params
      if (!id) return
      getShareInfo(id)
        .then((res) => {
          this.setState({ ...(res as any as IShareComponent), loading: false })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    }
  },
  function ({ state, events }) {
    const {
      loading,
      id,
      color,
      summary,
      location,
      description,
      calendarName,
      createMemberName,
      creatorMemberId,
      dtstart,
      dtend,
      fullDay,
      repeatStatus,
      repeatType,
      repeatByday,
      repeatBymonth,
      repeatBymonthday,
      repeatInterval,
      repeatUntil
    } = state
    const usedNav = useNav()
    const accessToken = cacheGetSync('accessToken')
    const userInfo = useRecoilValue(userInfoStore)

    return (
      <Container
        navTitle='日程邀请'
        className='pages-component-shareview-index '
        enablePagePullDownRefresh={false}
        useNav={usedNav}
        useMenuBtns={usedNav}
        loading={loading}
      >
        <View className='van-page-box'>
          <Cell className='summany'>
            <View className='event-label' style={{ color: `#${color}`, background: `#${color}` }}></View>
            <View className='calendar'>
              <View className='margin-left event-calendar'>
                <View className='title'>{summary}</View>
                <View>{calendarName}</View>
              </View>
            </View>
          </Cell>
          <Cell className='start-time' icon='clock-o'>
            <View className='margin-left event-content'>
              {dayjs(dtstart).isSame(dtend, 'date') ? (
                <SameDay
                  dtstart={dtstart}
                  dtend={dtend}
                  fullDay={fullDay}
                  repeatStatus={repeatStatus}
                  repeatType={repeatType}
                  repeatByday={repeatByday}
                  repeatBymonth={repeatBymonth}
                  repeatBymonthday={repeatBymonthday}
                  repeatInterval={repeatInterval}
                  repeatUntil={repeatUntil}
                ></SameDay>
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
                  repeatUntil={repeatUntil}
                ></DifferentDay>
              )}
            </View>
          </Cell>

          <View className='divider'></View>
          <Cell className='description' icon='description'>
            {description || '无描述'}
          </Cell>
          <Cell icon='user-o' title='组织者'>
            <Tag>{createMemberName}</Tag>
          </Cell>
        </View>
        <View className='van-page-button'>
          {!accessToken ? (
            <Button type='danger' block onClick={() => Router.toLogin()}>
              去登录
            </Button>
          ) : (
            <>
              {creatorMemberId !== userInfo?.id && (
                <Button type='danger' block>
                  接受
                </Button>
              )}
            </>
          )}
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
