/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-28 17:56:35
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendaredit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Router from 'tarojs-router-next'
import { Button, Cell, CellGroup, Field, Switch, Unite } from '@antmjs/vantui'
import { useRecoilValue } from 'recoil'
import { Textarea, View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import { get, update, create, remove } from '@/api/calendar'
import { useNavigationBar } from 'taro-hooks'
import { IUserInfo } from '~/../@types/user'
import { userInfoStore } from '@/store'
import { ColorRadio, AlarmRadio } from './ui'
import Fixedview from '@/components/fixedview'

import './index.less'

export default Unite(
  {
    state: {
      id: undefined,
      title: '新建日历',
      name: undefined,
      createMemberId: undefined,
      color: 'ee0a24',
      calendarId: undefined,
      description: undefined,
      major: 0,
      display: 1,
      alarmType: 1,
      alarmTime: 15,
      isShare: 0,
      memberId: undefined,
      loading: false
    },

    async onLoad() {
      const data = Router.getData()
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        this._initData(data)
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { calendarId } = Router.getParams()
      if (!calendarId) return
      get(calendarId)
        .then((res) => {
          this._initData(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _initData(data: any) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { id, name, createMemberId, color, calendarId, description, major, display, alarmType, alarmTime, isShare, memberId } = data
      this.setState({
        id,
        name,
        createMemberId,
        color,
        calendarId,
        description,
        major,
        display,
        alarmType,
        alarmTime,
        isShare,
        memberId,
        title: '编辑日历'
      })
      this.hooks['setTitle']('编辑日历')
    },

    setColor(color: string) {
      this.setState({
        color
      })
    },

    setName(name: string) {
      this.setState({
        name
      })
    },

    setDescription(description: string) {
      this.setState({
        description
      })
    },

    setAlarmType(alarmType: number) {
      this.setState({
        alarmType
      })
    },

    setAlarmTime(alarmTime: number) {
      this.setState({
        alarmTime
      })
    },

    setDisplay(display: number) {
      this.setState({
        display
      })
    },

    setIsShare(isShare: number) {
      this.setState({
        isShare
      })
    }
  },

  function ({ state, events }) {
    console.log(state)
    const userInfo: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const { id, color, name, title, major, alarmType, createMemberId, alarmTime, display, isShare, description, loading } = state
    const [, { setTitle }] = useNavigationBar({
      title: title
    })
    const { setName, setColor, setDescription, setAlarmType, setAlarmTime, setDisplay, setIsShare } = events
    events.setHooks({
      setTitle: setTitle
    })

    return (
      <Container
        navTitle={title}
        enablePagePullDownRefresh={false}
        className='pages-calendar-edit-index'
        renderPageTopHeader={() => {
          return <Header title={title} left to={4}></Header>
        }}
      >
        dddd
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
