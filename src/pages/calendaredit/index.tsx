/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-27 08:53:52
 * @FilePath: \xut-calendar-vant-weapp\src\pages\calendaredit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Router from 'tarojs-router-next'
import { Button, Cell, CellGroup, Dialog, Field, Loading, Overlay, Switch } from '@antmjs/vantui'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Textarea, View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import { calendarStore, userInfoStore } from '@/calendar/store/store'
import calendar from '@/calendar'
import { ColorRadio, AlarmRadio } from './ui'
import './index.less'
import { User } from '@/calendar/api/interface'

export default Unite(
  {
    state: {
      id: '',
      name: '',
      createMemberId: '',
      color: 'ee0a24',
      calendarId: '',
      description: '',
      major: 0,
      display: 1,
      alarmType: 1,
      alarmTime: 15,
      isShare: 0,
      memberId: '',
      disable: false
    },

    async onLoad() {
      const data = Router.getData()
      if (data) {
        this._initData(data)
        return
      }
      const { calendarId } = Router.getParams()
      if (!calendarId) return
      calendar.$api.calendar
        .get(calendarId)
        .then((res) => {
          this._initData(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _initData(data: any) {
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
        memberId
      })
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
    },

    commit() {
      if (!this._checkForm()) {
        return
      }
      this.setState({
        disable: true
      })
      if (!this.state.id) {
        calendar.$api.calendar
          .create(
            Object.assign({}, this.state, {
              id: '000',
              createMemberName: this.hooks['userInfo'].name,
              checked: true,
              alarmType: this.state.alarmType.toString()
            })
          )
          .then(() => {
            this._success('新增成功')
          })
          .catch((err) => {
            this._error(err)
          })
        return
      }
      calendar.$api.calendar
        .update(
          Object.assign({}, this.state, {
            createMemberName: this.hooks['userInfo'].name,
            checked: true,
            alarmType: this.state.alarmType.toString()
          })
        )
        .then(() => {
          this._success('修改成功')
        })
        .catch((error) => {
          this._error(error)
        })
    },

    removeCalendar() {
      Dialog.confirm({
        title: '提示',
        message: '是否确认删除？',
        selector: 'vanDialog0'
      }).then((value) => {
        if (value === 'cancel') return
        this.setState({
          disable: true
        })
        calendar.$api.calendar
          .remove(this.state.calendarId)
          .then(() => {
            this._success('删除成功')
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              disable: true
            })
          })
      })
    },

    _checkForm() {
      if (!this.state.name) {
        this.hooks['toast']({ title: '名称不能为空' })
        return false
      }
      if (!this.state.description) {
        this.hooks['toast']({ title: '描述不能为空' })
        return false
      }
      return true
    },

    _success(msg: string) {
      calendar.$api.calendar
        .list()
        .then((res) => {
          this.hooks['setCalendarStore'](res.data)
          this.hooks['toast']({
            title: msg,
            icon: 'success'
          }).then(() => {
            this.setState({
              disable: false
            })
          })
          window.setTimeout(() => {
            calendar.$hooks.back({
              to: 4,
              data: {
                data: '1'
              }
            })
          }, 1500)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _error(err: string) {
      this.hooks['toast']({
        title: err,
        icon: 'error'
      })
      return false
    }
  },

  function ({ state, events }) {
    const userInfo: User.IUserInfo | undefined = useRecoilValue(userInfoStore)
    const setCalendarStore = useSetRecoilState(calendarStore)
    const { id, color, name, major, alarmType, createMemberId, alarmTime, display, isShare, description, disable } = state
    const { setName, setColor, setDescription, setAlarmType, setAlarmTime, setDisplay, setIsShare, commit, removeCalendar } = events
    const usedNav = calendar.$hooks.useNav()
    const { show } = useToast({
      icon: 'error'
    })
    events.setHooks({
      toast: show,
      userInfo: userInfo,
      setCalendarStore: setCalendarStore
    })

    return (
      <Container navTitle='日历编辑' enablePagePullDownRefresh={false} className='pages-calendar-edit-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='box'>
          <Cell>
            <ColorRadio onChage={(e) => setColor(e)} defaultColor={color}></ColorRadio>
          </Cell>
          <Field label='名称' border={false} placeholder='请输入名称' maxlength={20} value={name} onChange={(e) => setName(e.detail)}></Field>
          <CellGroup title='描述'>
            <Textarea
              style={{ width: '100%', height: '60px' }}
              value={description}
              maxlength={120}
              onInput={(e) => {
                setDescription(e.detail.value)
              }}
            />
          </CellGroup>
          <Cell title='显示方式'>
            <Switch checked={display === 1} onChange={(e) => setDisplay(e.detail ? 1 : 0)}></Switch>
          </Cell>

          <Cell title='共享方式'>
            <Switch checked={isShare === 1} onChange={(e) => setIsShare(e.detail ? 1 : 0)} />
          </Cell>
          <CellGroup title='提醒方式'>
            <Cell>
              <AlarmRadio type='alarmType' defaultValue={alarmType.toString()} onChange={(e) => setAlarmType(Number.parseInt(e.detail))}></AlarmRadio>
            </Cell>
          </CellGroup>
          <CellGroup title='提醒时间'>
            <Cell>
              <AlarmRadio
                type='alarmTime'
                disable={alarmType === 0}
                defaultValue={alarmTime.toString()}
                onChange={(e) => setAlarmTime(Number.parseInt(e.detail))}
              ></AlarmRadio>
            </Cell>
          </CellGroup>
        </View>
        <View className='button'>
          <View className='btn'>
            {!!id && major !== 1 && !!userInfo && createMemberId === userInfo.id && (
              <Button type='danger' block disabled={disable} onClick={removeCalendar}>
                删除
              </Button>
            )}
            <View className='space'></View>
            <Button type='info' block disabled={disable} onClick={commit}>
              保存
            </Button>
          </View>
        </View>
        <Overlay show={disable}>
          <Loading size='24px' type='spinner' vertical color='#000'>
            加载中...
          </Loading>
        </Overlay>
        <Dialog id='vanDialog0' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
