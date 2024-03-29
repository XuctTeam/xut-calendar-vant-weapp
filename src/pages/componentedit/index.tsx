/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:53:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Textarea, View } from '@tarojs/components'
import { Button, Cell, Col, Icon, Loading, Overlay, Row, Switch } from '@antmjs/vantui'
import Router, { NavigateType } from 'tarojs-router-next'
import dayjs, { Dayjs } from 'dayjs'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useToast, useRequestSubscribeMessage } from 'taro-hooks'
import Container from '@/components/container'
import { formatRepeatTime, fiveMinutes, formatAlarmText, alarmTypeToCode } from '@/calendar/utils'
import { Calendar, User } from '@/calendar/api/interface'
import calendar from '@/calendar'
import { Picker, Time, CalendarAction, SelectCalendar, GridAction, RepeatPicker } from './ui'

import './index.less'

const today = dayjs().toDate()
const todayPre = fiveMinutes(today)
const todayNext = dayjs(todayPre).add(1, 'hour').toDate()

export default Unite(
  {
    state: {
      edit: false,
      saving: false,
      id: undefined,
      loading: false,
      summary: '',
      fullDay: 0,
      dtstart: todayPre,
      dtend: todayNext,
      place: '',
      pickDtStartOpen: false,
      pickDtEndOpen: false,
      repeatStatus: '0',
      repeatType: '',
      repeatByday: '',
      repeatBymonth: '',
      repeatBymonthday: '',
      repeatPickerOpen: false,
      repeatInterval: 1,
      repeatUntil: null,
      alarmType: '0',
      alarmTimes: [],
      description: '',
      selectCalendarOpen: false,
      selectedCalendar: undefined,
      memberIds: []
    },

    async onLoad() {
      const { id } = this.location.params
      if (!id) {
        this._initCalendar()
        return
      }
      this._init(id || '')
    },

    async _init(id: string) {
      this.setState({
        loading: true,
        id
      })
      let result
      try {
        result = await Promise.all([calendar.$api.component.getById(id), calendar.$api.component.queryComponentMemberIds(id)])
      } catch (err) {
        console.log(err)
      }
      if (!(result && result.length === 2)) return
      const _component = result[0].data
      const _mergeComponent = Object.assign(
        {},
        { ..._component },
        {
          edit: true,
          dtstart: dayjs(_component.dtstart).toDate(),
          dtend: dayjs(_component.dtend).toDate(),
          alarmType: alarmTypeToCode(_component.alarmType),
          alarmTimes: _component.alarmTimes ? _component.alarmTimes.split(',') : [],
          repeatStatus: _component.repeatStatus + '',
          repeatUntil: _component.repeatUntil ? dayjs(_component.repeatUntil).toDate() : null,
          memberIds: result[1].data
        }
      )
      this.setState({ ..._mergeComponent, loading: false })
      this._initCalendar(_mergeComponent.calendarId)
    },

    setSummary(summary: string) {
      this.setState({
        summary
      })
    },

    setFullDay(fullDay: number) {
      this.setState({
        fullDay
      })
    },

    setPickDtStartOpen(pickDtStartOpen: boolean) {
      this.setState({
        pickDtStartOpen
      })
    },

    setPickDtEndOpen(pickDtEndOpen: boolean) {
      this.setState({
        pickDtEndOpen
      })
    },

    setDtstart(time: number) {
      const _day = dayjs(time).toDate()
      if (dayjs(this.state.dtend).isBefore(dayjs(_day))) {
        this.setState({
          dtstart: _day,
          dtend: dayjs(_day).add(1, 'hour').toDate(),
          pickDtStartOpen: false
        })
        return
      }
      this.setState({
        dtstart: _day,
        pickDtStartOpen: false
      })
    },

    setDtend(time: number) {
      this.setState({
        dtend: dayjs(time).toDate(),
        pickDtEndOpen: false
      })
    },

    setSelectCalendarOpen(selectCalendarOpen: boolean) {
      this.setState({
        selectCalendarOpen
      })
    },

    setSelectedCalendar(selectedCalendar: Calendar.IDavCalendar) {
      this.setState({
        selectedCalendar
      })
    },

    async setPlaceChoose() {
      try {
        const result = await Router.toComponenteditlocation()
        if (!result) return
        const { place } = result
        this.setState({
          place
        })
      } catch (err) {
        console.log(err)
      }
    },

    async setDescriptionChoose() {
      try {
        const result = await Router.toComponenteditdescription()
        if (!result) return
        const { description } = result
        this.setState({
          description
        })
      } catch (err) {
        console.log(err)
      }
    },

    setDescription(val: string) {
      this.setState({
        description: val
      })
    },

    setPlace(place: string) {
      this.setState({
        place
      })
    },

    setCalendarChoose(id: string) {
      const calendar = this.hooks['calendars'].find((i) => i.id === id)
      this.setState({
        selectedCalendar: calendar,
        selectCalendarOpen: false,
        alarmType: calendar ? calendar.alarmType + '' : '0',
        alarmTimes: calendar ? [calendar.alarmTime + ''] : []
      })
    },

    async setAlarmChoose() {
      try {
        const params = {}
        if (this.state.alarmTimes && this.state.alarmType) {
          params['alarmType'] = this.state.alarmType
          params['alarmTimes'] = this.state.alarmTimes.join(',')
        }
        const result = await Router.toComponenteditalarm({
          params
        })
        if (!result) return
        const { alarmType, alarmTimes } = result
        if (!alarmType || !alarmTimes) return
        this.setState({
          alarmType,
          alarmTimes
        })
      } catch (err) {
        console.log(err)
      }
    },

    async setRepeatChoose() {
      try {
        const result = await Router.toComponenteditrepeat({
          data: {
            selectedDate: this.state.dtstart,
            repeatStatus: this.state.repeatStatus,
            repeatType: this.state.repeatType,
            repeatInterval: this.state.repeatInterval,
            repeatByday: this.state.repeatByday,
            repeatBymonth: this.state.repeatBymonth,
            repeatBymonthday: this.state.repeatBymonthday
          }
        })
        if (result) {
          this.setState({ ...result })
        }
      } catch (err) {
        console.log(err)
        Router.toIndex({ type: NavigateType.switchTab })
      }
    },

    setRepeatReset() {
      this.setState({
        repeatStatus: '0',
        repeatInterval: 1,
        repeatType: '',
        repeatByday: '',
        repeatBymonth: '',
        repeatBymonthday: '',
        repeatUntil: null
      })
    },

    setRepeatPickerOpen(repeatPickerOpen: boolean) {
      this.setState({
        repeatPickerOpen
      })
    },

    setRepeatUntilChoose(repeatUntil: string | number | null) {
      if (!repeatUntil) {
        this.setState({
          repeatUntil: null,
          repeatPickerOpen: false
        })
        return
      }
      this.setState({
        repeatUntil: dayjs(repeatUntil).toDate(),
        repeatPickerOpen: false
      })
    },

    setSaving(saving: boolean) {
      this.setState({
        saving
      })
    },

    async setMembersChoose() {
      try {
        const result = await Router.toComponenteditmembers({
          data: {
            members: this.state.memberIds
          }
        })
        if (!result) return
        const { members } = result
        if (!members) return
        this.setState({
          memberIds: members
        })
      } catch (err) {
        console.log(err)
      }
    },

    saveOrUpdateComponent() {
      if (!this.state.summary) {
        this.hooks['toast']({ title: '标题不能为空' })
        return
      }
      if (!this.state.selectedCalendar) {
        this.hooks['toast']({ title: '选择日历不能为空' })
        return
      }

      if (this.state.repeatStatus !== '0' && !this.state.repeatUntil) {
        this.hooks['toast']({ title: '循环日期不能为空' })
        return
      }
      const start: Dayjs = dayjs(this.state.dtstart)
      const end: Dayjs = dayjs(this.state.dtend)
      if (end.isBefore(start)) {
        this.hooks['toast']({ title: '结束时间小于开始时间' })
        return
      }
      if (end.diff(start) < 3600) {
        this.hooks['toast']({ title: '时间范围应大于1小时' })
        return
      }
      this.setState({
        saving: true
      })
      const addOrUpdateComponent = {
        id: this.state.id,
        summary: this.state.summary,
        calendarId: this.state.selectedCalendar.calendarId,
        creatorMemberId: this.hooks['userInfo'].id,
        location: this.state.place,
        description: this.state.description,
        dtstart: this.state.dtstart,
        dtend: this.state.dtend,
        fullDay: this.state.fullDay,
        repeatStatus: this.state.repeatStatus,
        repeatType: this.state.repeatType,
        repeatInterval: this.state.repeatInterval,
        repeatByday: this.state.repeatByday,
        repeatBymonth: this.state.repeatBymonth,
        repeatBymonthday: this.state.repeatBymonthday,
        repeatUntil: this.state.repeatUntil,
        alarmType: this.state.alarmType,
        alarmTimes: this.state.alarmTimes,
        memberIds: this.state.memberIds
      }

      calendar.$api.component
        .add(addOrUpdateComponent)
        .then((res) => {
          addOrUpdateComponent.id = res as any as string
          //要刷新首页列表
          this.hooks['setComponentRefreshTime'](dayjs().valueOf())
          if (process.env.TARO_ENV !== 'weapp') {
            this.setState({
              saving: false
            })
            this._toView(addOrUpdateComponent.id)
            return
          }
          this.setState({
            saving: false
          })
          this._subscribeMessage(addOrUpdateComponent.id)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _initCalendar(calendarId?: string) {
      const { calendars } = this.hooks
      if (!(calendars && calendars.length > 0)) return
      if (!calendarId) {
        const _majorCalendar = calendars.find((i: Calendar.IDavCalendar) => i.major === 1)
        if (!_majorCalendar) return
        this.setState({
          selectedCalendar: _majorCalendar
        })
        return
      }
      const _majorCalendar = calendars.find((i) => i.calendarId === calendarId)
      this.setState({
        selectedCalendar: _majorCalendar
      })
    },

    async _subscribeMessage(id: string) {
      const subscribeIds = process.env.TEMPLATE_ID?.IDS
      try {
        const { [subscribeIds]: result } = await this.hooks['requestSubscribeMessage'](subscribeIds)
        if (result === 'accept') {
          console.log('message accept')
        }
        this._toView(id)
      } catch (e) {
        console.log(e)
      }
    },

    _toView(id: string) {
      if (this.state.edit) {
        this.hooks['toast']({
          icon: 'success',
          title: '编辑成功'
        })
        window.setTimeout(() => {
          this.hooks['back']({
            delta: 2
          })
        }, 1500)
        return
      }
      this.hooks['toast']({
        icon: 'success',
        title: '新增成功'
      })
      window.setTimeout(() => {
        Router.toComponentview({
          params: {
            id,
            from: '2'
          }
        })
      }, 1500)
    }
  },
  function ({ state, events }) {
    const {
      loading,
      saving,
      summary,
      dtstart,
      dtend,
      place,
      fullDay,
      pickDtStartOpen,
      pickDtEndOpen,
      repeatStatus,
      repeatType,
      repeatByday,
      repeatBymonth,
      repeatBymonthday,
      repeatInterval,
      repeatUntil,
      alarmType,
      alarmTimes,
      description,
      memberIds,
      selectCalendarOpen,
      selectedCalendar,
      repeatPickerOpen
    } = state
    const {
      setSummary,
      setFullDay,
      setPickDtStartOpen,
      setDtstart,
      setPickDtEndOpen,
      setDtend,
      setSelectCalendarOpen,
      setPlaceChoose,
      setPlace,
      setDescriptionChoose,
      setDescription,
      setCalendarChoose,
      setAlarmChoose,
      setRepeatChoose,
      setRepeatReset,
      setRepeatPickerOpen,
      setRepeatUntilChoose,
      setMembersChoose,
      saveOrUpdateComponent
    } = events
    const userInfoState: User.IUserInfo | undefined = useRecoilValue(calendar.$store.userInfoStore)
    const calendars = useRecoilValue(calendar.$store.calendarStore)
    const setComponentRefreshTime = useSetRecoilState(calendar.$store.componentRefreshTimeStore)
    const { show } = useToast({
      icon: 'error'
    })

    const [back] = calendar.$hooks.useBack({ to: 1 })
    const usedNav = calendar.$hooks.useNav()

    const { subscribe } = useRequestSubscribeMessage()

    events.setHooks({
      toast: show,
      back: back,
      userInfo: userInfoState,
      calendars: calendars,
      setComponentRefreshTime: setComponentRefreshTime,
      requestSubscribeMessage: subscribe
    })

    return (
      <Container
        navTitle='日程编辑'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-index'
        useNav={usedNav}
        useMenuBtns={usedNav}
        loading={loading}
      >
        <View className='van-page-box'>
          <Cell>
            <Textarea
              placeholder='输入日程标题'
              maxlength={120}
              value={summary}
              style={{ width: '100%' }}
              autoFocus
              onInput={(e) => setSummary(e.detail.value)}
            />
          </Cell>
          <View className='divider'></View>
          <Cell title='全天' className='all-day'>
            <Switch checked={fullDay === 1} onChange={(e) => setFullDay(e.detail ? 1 : 0)} />
          </Cell>
          <View className='picker'>
            <Row>
              <Col span={10} key={1}>
                <Time time={dtstart} fullDay={fullDay} onClick={() => setPickDtStartOpen(true)}></Time>
              </Col>
              <Col span={4} key={2}>
                <Icon name='arrow'></Icon>
              </Col>
              <Col span={10} key={3}>
                <Time time={dtend} fullDay={fullDay} onClick={() => setPickDtEndOpen(true)}></Time>
              </Col>
            </Row>
          </View>
          {place && (
            <Cell icon='location-o' renderRightIcon={<Icon name='cross' onClick={() => setPlace('')} />} clickable>
              {place}
            </Cell>
          )}
          {!!userInfoState && memberIds.length !== 0 && (
            <Cell icon='manager-o' title='组织者' className='manager'>
              {userInfoState.name}
            </Cell>
          )}
          <Cell icon='friends-o' clickable isLink onClick={setMembersChoose}>
            {memberIds.length !== 0 ? `共邀请（${memberIds.length}）人` : '添加参与者'}
          </Cell>
          {repeatStatus !== '0' && (
            <>
              <Cell icon='replay' renderRightIcon={<Icon name='cross' onClick={setRepeatReset}></Icon>}>
                {formatRepeatTime(repeatType, repeatStatus, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval)}
              </Cell>
              <Cell
                clickable
                icon='clock-o'
                title={!repeatUntil ? '选择结束时间' : ''}
                onClick={() => setRepeatPickerOpen(true)}
                renderRightIcon={
                  <Icon
                    name='cross'
                    onClick={(e) => {
                      e.stopPropagation()
                      setRepeatUntilChoose(null)
                    }}
                  ></Icon>
                }
              >
                {repeatUntil ? dayjs(repeatUntil).format('YYYY年MM月DD日') + ' 结束重复' : ''}
              </Cell>
            </>
          )}
          <Cell icon='bulb-o' isLink clickable onClick={setAlarmChoose}>
            {formatAlarmText(alarmType, alarmTimes)}
          </Cell>
          {description && (
            <Cell icon='description' renderRightIcon={<Icon name='cross' onClick={() => setDescription('')} />} clickable>
              {description}
            </Cell>
          )}
          <View className='divider'></View>
          <Cell icon='calendar-o' isLink clickable onClick={() => setSelectCalendarOpen(true)}>
            <SelectCalendar
              color={selectedCalendar ? selectedCalendar.color : '2eb82e'}
              title={selectedCalendar ? selectedCalendar.name : '无日历'}
            ></SelectCalendar>
          </Cell>
          <GridAction
            repeatStatus={repeatStatus}
            place={place}
            description={description}
            setPlaceChoose={setPlaceChoose}
            setDescriptionChoose={setDescriptionChoose}
            setRepeatChoose={setRepeatChoose}
          ></GridAction>
        </View>

        <View className='van-page-button'>
          <Button type='info' block onClick={saveOrUpdateComponent}>
            保存
          </Button>
        </View>
        <Picker
          fullDay={fullDay}
          show={pickDtStartOpen}
          selectedDay={dtstart}
          onClose={() => setPickDtStartOpen(false)}
          onSelected={(e) => {
            setDtstart(e.detail.value)
          }}
        ></Picker>
        <Picker
          fullDay={fullDay}
          show={pickDtEndOpen}
          selectedDay={dtend}
          onClose={() => setPickDtEndOpen(false)}
          onSelected={(e) => {
            setDtend(e.detail.value)
          }}
        ></Picker>
        <CalendarAction show={selectCalendarOpen} onClose={() => setSelectCalendarOpen(false)} calendars={calendars} onSelect={setCalendarChoose} />
        <RepeatPicker
          show={repeatPickerOpen}
          selectedDate={repeatUntil}
          minDate={dtend}
          onClose={() => setRepeatPickerOpen(false)}
          onConfirm={setRepeatUntilChoose}
        ></RepeatPicker>
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
