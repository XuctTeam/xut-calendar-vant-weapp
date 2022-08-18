/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-18 09:32:59
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditalarm\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import { Button, Cell, CellGroup, Checkbox, RadioGroup, Unite, Radio, CheckboxGroup } from '@antmjs/vantui'
import Container from '@/components/container'

import Header from '@/components/header'
import './index.less'
import { useBack } from '@/utils/taro'

const alrams = [
  {
    key: '15',
    value: '开始前15分钟'
  },
  {
    key: '30',
    value: '开始前30分钟'
  },
  {
    key: '60',
    value: '开始前1小时'
  },
  {
    key: '1440',
    value: '开始前1天'
  }
]

export default Unite(
  {
    state: {
      openAlarm: '0',
      alarmTime: [],
      alarmType: '1'
    },

    async onLoad() {
      const { alarmType, alarmTimes } = this.location.params
      if (alarmType === undefined) return
      if (alarmType.toString() === '0') {
        this.setState({
          openAlarm: '1'
        })
        return
      }
      if (!alarmTimes) return
      const _alarmTimes = alarmTimes
        .toString()
        .split(',')
        .map((i) => {
          return i + ''
        })
      this.setState({
        alarmType: alarmType.toString(),
        alarmTime: _alarmTimes
      })
    },

    setOpenAlarm(openAlarm: string) {
      this.setState({
        openAlarm,
        alarmTime: []
      })
    },

    setAlarmTime(alarmTime: string[]) {
      this.setState({
        alarmTime: alarmTime,
        openAlarm: '0'
      })
    },

    setAlarmType(alarmType: string) {
      this.setState({
        alarmType
      })
    },

    saveAlarm() {
      const sortAlarmTime = this.state.alarmTime.sort((n1, n2) => {
        return Number.parseInt(n1) - Number.parseInt(n2)
      })
      this.hooks['back']({
        data: {
          alarmType: this.state.openAlarm === '1' ? '0' : this.state.alarmType,
          alarmTimes: this.state.openAlarm === '1' ? [] : sortAlarmTime
        }
      })
    }
  },
  function ({ state, events }) {
    const { openAlarm, alarmTime, alarmType } = state
    const { setOpenAlarm, setAlarmTime, setAlarmType, saveAlarm } = events
    const [back] = useBack({
      to: 1
    })
    events.setHooks({
      back: back
    })

    return (
      <Container
        navTitle='提醒选择'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-alarm-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='提醒选择' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Cell title='不提醒'>
            <RadioGroup value={openAlarm} onChange={(e) => setOpenAlarm(e.detail)}>
              <Radio name='1' style={{ justifyContent: 'flex-end' }} />
            </RadioGroup>
          </Cell>
          <View className='divider'></View>
          <CheckboxGroup value={alarmTime} onChange={(e) => setAlarmTime(e.detail)}>
            <CellGroup>
              {alrams.map((item, index) => {
                return (
                  <Cell key={index} title={item.value} clickable>
                    <Checkbox shape='square' style={{ justifyContent: 'flex-end' }} name={item.key} />
                  </Cell>
                )
              })}
            </CellGroup>
            <CellGroup></CellGroup>
          </CheckboxGroup>
          <View className='divider'></View>
          <CellGroup title='提醒方式' border={false}>
            <RadioGroup direction='horizontal' value={alarmType} disabled={openAlarm === '1'} onChange={(e) => setAlarmType(e.detail)}>
              <Radio name='1'>站内信</Radio>
              <Radio name='2'>邮箱</Radio>
              <Radio name='3'>公众号</Radio>
            </RadioGroup>
          </CellGroup>
        </View>
        <View className='van-page-button'>
          <Button type='info' block onClick={saveAlarm}>
            保存
          </Button>
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
