/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 19:09:09
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

const alrams = ['15', '30', '60', '1440']

export default Unite(
  {
    state: {
      openAlarm: '0',
      alarmTime: [],
      alarmType: '1'
    },

    async onLoad() {
      const { alarmType, alarmTimes } = this.location.params
      if (!(alarmTimes && alarmType)) return
      if (alarmType.toString() === '0') {
        this.setState({
          openAlarm: '1'
        })
        return
      }
      const _alarmTimes = alarmTimes
        .toString()
        .split(',')
        .map((i) => {
          return i + ''
        })
      this.setState({
        alarmType: alarmType,
        alarmTime: _alarmTimes
      })
    },

    setOpenAlarm(openAlarm: string) {
      this.setState({
        openAlarm
      })
    }
  },
  function ({ state, events }) {
    const { openAlarm, alarmTime, alarmType } = state
    const { setOpenAlarm } = events

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
              <Radio name='1' />
            </RadioGroup>
          </Cell>
          <View className='divider'></View>
          <CheckboxGroup value={alarmTime}>
            <CellGroup>
              {alrams.map((item, index) => {
                return (
                  <Cell key={index} title={'复选框 ' + item} clickable>
                    <Checkbox style={{ justifyContent: 'flex-end' }} name={item} />
                  </Cell>
                )
              })}
            </CellGroup>
            <CellGroup></CellGroup>
          </CheckboxGroup>
          <View className='divider'></View>
          <CellGroup title='提醒方式' border={false}>
            <RadioGroup direction='horizontal'>
              <Radio name='1'>站内信</Radio>
              <Radio name='2'>邮箱</Radio>
              <Radio name='3'>公众号</Radio>
            </RadioGroup>
          </CellGroup>
        </View>
        <View className='van-page-button'>
          <Button type='info' block>
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
