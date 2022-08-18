/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-18 11:26:40
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditcustomrepreat\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { ActionSheet, Button, Cell, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import dayjs from 'dayjs'
import { IntervalPicker, Monthly, Weekly } from './ui'
import { useBack } from '@/utils/taro'
import './index.less'
import Router from 'tarojs-router-next'

export default Unite(
  {
    state: {
      repeatTypeOpen: false,
      intervalOpen: false,
      repeatType: 'DAILY',
      repeatInterval: 1,
      selectedWeek: [],
      selectedDate: dayjs().toDate(),
      selectedMonthDay: '1'
    },

    async onLoad() {
      let data = Router.getData()
      if (!data) {
        return
      }
      if (!data.repeatType) return

      const { selectedDate, repeatType, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval } = data
      let _selectedWeek = []
      let _selectedMonthDay = '1'
      if (data.repeatType === 'WEEKLY') {
        _selectedWeek = repeatByday.split(',').map((i) => {
          return i.split(':')[1]
        })
      } else if (data.repeatType === 'MONTHLY') {
        if (!repeatBymonth && !repeatBymonthday && repeatByday) {
          _selectedMonthDay = '2'
        }
      }
      this.setState({
        selectedDate,
        repeatType,
        repeatInterval,
        selectedWeek: _selectedWeek,
        selectedMonthDay: _selectedMonthDay
      })
    },

    formatType(type: string) {
      switch (type) {
        case 'DAILY':
          return '天'
        case 'WEEKLY':
          return '周'
        case 'MONTHLY':
          return '月'
        default:
          return '年'
      }
    },

    setIntervalSelected(value: number) {
      this.setState({
        repeatInterval: value,
        intervalOpen: false
      })
    },

    setRepeatSelected(repeatType: string) {
      this.setState({
        repeatType,
        repeatTypeOpen: false
      })
    },

    setWeekSelected(values: string[]) {
      this.setState({
        selectedWeek: values
      })
    },

    setMonthDaySelected(selectedMonthDay: string) {
      this.setState({
        selectedMonthDay
      })
    },

    setRepeatTypeOpen(repeatTypeOpen: boolean) {
      this.setState({
        repeatTypeOpen
      })
    },

    setIntervalOpen(intervalOpen: boolean) {
      this.setState({
        intervalOpen
      })
    },

    saveCustRepeat() {
      this.hooks['back']({
        data: {
          repeatType: this.state.repeatType,
          repeatInterval: this.state.repeatInterval,
          selectedWeek: this.state.selectedWeek.sort((n1, n2) => Number.parseInt(n1) - Number.parseInt(n2)),
          selectedMonthDay: this.state.selectedMonthDay
        }
      })
    }
  },
  function ({ state, events }) {
    const { repeatTypeOpen, intervalOpen, repeatType, repeatInterval, selectedWeek, selectedDate, selectedMonthDay } = state
    const { setRepeatTypeOpen, setIntervalOpen, formatType, setIntervalSelected, setRepeatSelected, setWeekSelected, setMonthDaySelected, saveCustRepeat } =
      events

    const [back] = useBack({
      to: 1
    })

    events.setHooks({
      back: back
    })

    return (
      <Container
        navTitle='自定义循环'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-custom-repeat-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='自定义循环' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Cell title='频率' clickable onClick={() => setRepeatTypeOpen(true)}>
            {formatType(repeatType)}
          </Cell>
          <Cell title='每' clickable onClick={() => setIntervalOpen(true)}>
            {repeatInterval + formatType(repeatType)}
          </Cell>
          {repeatType === 'WEEKLY' ? (
            <Weekly defaultValues={selectedWeek} weekSelected={setWeekSelected}></Weekly>
          ) : repeatType === 'MONTHLY' ? (
            <Monthly selectedDate={selectedDate} selectedMonthDay={selectedMonthDay} monthDaySelected={setMonthDaySelected}></Monthly>
          ) : (
            <></>
          )}
        </View>
        <View className='van-page-button'>
          <Button block type='info' onClick={saveCustRepeat}>
            保存
          </Button>
        </View>

        <ActionSheet
          title='循环频率'
          show={repeatTypeOpen}
          cancelText='取消'
          onCancel={() => setRepeatTypeOpen(false)}
          actions={[
            {
              name: '天',
              color: 'DAILY'
            },
            {
              name: '周',
              color: 'WEEKLY'
            },
            {
              name: '月',
              color: 'MONTHLY'
            },
            {
              name: '年',
              color: 'YEARLY'
            }
          ]}
          onClose={() => setRepeatTypeOpen(false)}
          onSelect={(e) => setRepeatSelected(e.detail.color)}
        />
        <IntervalPicker
          open={intervalOpen}
          type={repeatType}
          repeatInterval={repeatInterval}
          onClose={() => setIntervalOpen(false)}
          onSelected={setIntervalSelected}
        ></IntervalPicker>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})