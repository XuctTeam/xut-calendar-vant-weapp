/*
 * @Author: Derek Xu
 * @Date: 2022-11-08 13:08:13
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:59:45
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentshareview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { Button, Cell, Dialog, Loading, Overlay } from '@antmjs/vantui'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import Router from 'tarojs-router-next'
import { useToast } from 'taro-hooks'
import { componentRefreshTimeStore, userInfoStore } from '@/calendar/store/store'
import { cacheGetSync } from '@/calendar/cache/cache'
import Container from '@/components/container'
import calendar from '@/calendar'
import { Calendar } from '@/calendar/api/interface'
import { DifferentDay, SameDay } from './ui'

import './index.less'

interface IShareComponent extends Calendar.IDavComponent {
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
      attend: false,
      saving: false
    },

    async onLoad() {
      const { id } = this.location.params
      if (!id) return
      calendar.$api.component
        .getShareInfo(id)
        .then((res) => {
          this.setState({ ...(res as any as IShareComponent), id: id, loading: false })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    attendComponent() {
      Dialog.confirm({
        title: '提示',
        message: '确定接受吗？',
        selector: 'componentShareDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this.setState({
          saving: true
        })
        this._acceppt()
      })
    },

    _acceppt() {
      const self = this
      calendar.$api.component
        .acceptAttend(this.state.id)
        .then(() => {
          self.setState({
            attend: true,
            saving: false
          })
          self.hooks['setComponentRefreshTime'](dayjs().valueOf())
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            saving: false
          })
        })
    }
  },
  function ({ state, events }) {
    const {
      loading,
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
      repeatUntil,
      attend,
      saving
    } = state
    const { attendComponent } = events
    const usedNav = calendar.$hooks.useNav()
    const accessToken = cacheGetSync('accessToken')
    const userInfo = useRecoilValue(userInfoStore)
    const { show } = useToast({
      icon: 'error'
    })

    const setComponentRefreshTime = useSetRecoilState(componentRefreshTimeStore)

    events.setHooks({
      toast: show,
      setComponentRefreshTime: setComponentRefreshTime
    })

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
          <Cell className='location' icon='location-o' title='地点'>
            {location || ''}
          </Cell>
          <Cell icon='user-o' title='组织者'>
            {createMemberName}
          </Cell>
          <Cell className='description' icon='description'>
            {description || '无描述'}
          </Cell>
        </View>
        <View className='van-page-button'>
          {!accessToken ? (
            <Button type='danger' block onClick={() => Router.toLogin()}>
              去登录
            </Button>
          ) : (
            <>
              {creatorMemberId !== userInfo?.id && !attend && (
                <Button type='danger' block onClick={attendComponent}>
                  接受
                </Button>
              )}
            </>
          )}
        </View>
        <Dialog id='componentShareDialog' />
        <Overlay show={saving}>
          <Loading size='24px' type='spinner' vertical color='#000'>
            加载中...
          </Loading>
        </Overlay>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
