/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-20 00:15:56
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Textarea, View } from '@tarojs/components'
import { Button, Cell, Col, Grid, GridItem, Icon, Row, Switch, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import Router, { NavigateType } from 'tarojs-router-next'
import Header from '@/components/header'
import dayjs from 'dayjs'
import { calendarStore, userInfoStore } from '@/store'
import { add, getById, queryComponentMemberIds } from '@/api/component'
import { useRecoilValue } from 'recoil'
import { IUserInfo } from 'types/user'
import { formatRepeatTime, fiveMinutes, formatAlarmText, alarmTypeToCode } from '@/utils'
import { IDavCalendar } from 'types/calendar'
import { Picker, Time, CalendarAction, SelectCalendar, GridAction, RepeatPicker } from './ui'
import './index.less'

const today = dayjs().toDate()
const todayPre = fiveMinutes(today)
const todayNext = dayjs(todayPre).add(1, 'hour').toDate()

export default Unite(
  {
    state: {
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
        loading: true
      })
      const result = await Promise.all([getById(id), queryComponentMemberIds(id)])
      if (!(result && result.length === 2)) return
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

    setSelectedCalendar(selectedCalendar: IDavCalendar) {
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

    async setMembersChoose() {
      try {
        const result = await Router.toComponenteditmembers({
          data: {
            members: this.state.memberIds
          }
        })
        if (!result) return
        const { members } = result
        if (!(members && members.length > 0)) return
        this.setState({
          memberIds: members
        })
      } catch (err) {
        console.log(err)
      }
    },

    _initCalendar(calendarId?: string) {
      const { calendars } = this.hooks
      if (!(calendars && calendars.length > 0)) return
      if (!calendarId) {
        const majorCalendar = calendars.find((i) => i.major === 1)
        if (!majorCalendar) return
        this.setState({
          selectedCalendar: majorCalendar
        })
      }
    }
  },
  function ({ state, events }) {
    const {
      loading,
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
      setCalendarChoose,
      setAlarmChoose,
      setRepeatChoose,
      setRepeatReset,
      setRepeatPickerOpen,
      setRepeatUntilChoose,
      setMembersChoose
    } = events
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const calendars = useRecoilValue(calendarStore)

    events.setHooks({
      calendars: calendars
    })

    return (
      <Container
        navTitle='日程编辑'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-index'
        h5Nav={true}
        useNav={true}
        loading={loading}
        renderPageTopHeader={() => {
          return <Header title='日程编辑' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Textarea
            placeholder='输入日程标题'
            maxlength={120}
            value={summary}
            style={{ width: '100%' }}
            autoFocus
            onInput={(e) => setSummary(e.detail.value)}
          />
          <View className='divider'></View>
          <Cell title='全天' className='all-day'>
            <Switch checked={fullDay === 1} onChange={(e) => setFullDay(e.detail ? 1 : 0)} />
          </Cell>
          <View className='picker'>
            <Row>
              <Col span={10}>
                <Time time={dtstart} fullDay={fullDay} onClick={() => setPickDtStartOpen(true)}></Time>
              </Col>
              <Col span={4}>
                <Icon name='arrow'></Icon>
              </Col>
              <Col span={10}>
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
            <Cell icon='description' renderRightIcon={<Icon name='cross' />} clickable>
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
          <Button type='info' block>
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
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
