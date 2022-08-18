/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-18 11:19:57
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditrepeat\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, Cell, CellGroup, Icon, Radio, RadioGroup, Unite } from '@antmjs/vantui'
import Container from '@/components/container'

import Header from '@/components/header'
import dayjs from 'dayjs'
import Router, { NavigateType } from 'tarojs-router-next'
import './index.less'
import { formatRepeatTime } from '@/utils'
import { View } from '@tarojs/components'

export default Unite(
  {
    state: {
      selectedDate: dayjs().toDate(),
      repeatStatus: '0',
      repeatInterval: 1,
      repeatType: '',
      repeatByday: '',
      repeatBymonth: '',
      repeatBymonthday: ''
    },

    async onLoad() {
      const data = Router.getData()
      if (data) {
        this.setState({ ...this.state, ...data })
      }
    },

    setRepeatChoose(value: string) {
      let repeatType: string = '',
        repeatByday: string = '',
        repeatBymonth: number = 0,
        repeatBymonthday: number = 0
      if (value === '1') {
        repeatType = 'DAILY'
      } else if (value === '2') {
        repeatType = 'WEEKLY'
        repeatByday = '0:1,0:2,0:3,0:4,0:5'
      } else if (value === '3') {
        repeatType = 'WEEKLY'
        repeatByday = '0:6,0:0'
      } else if (value === '4') {
        repeatType = 'WEEKLY'
        repeatByday = '0:6'
      } else if (value === '5') {
        repeatType = 'MONTHLY'
        repeatBymonthday = dayjs(this.state.selectedDate).get('date')
      } else if (value === '6') {
        repeatType = 'MONTHLY'
        repeatByday = Math.ceil(this.state.selectedDate.getDate() / 7) + ':' + dayjs(this.state.selectedDate).day()
      } else if (value === '7') {
        repeatType = 'YEARLY'
        repeatBymonth = dayjs(this.state.selectedDate).get('month') + 1
        repeatBymonthday = dayjs(this.state.selectedDate).get('date')
      }
      this.setState({
        repeatType: repeatType,
        repeatByday: repeatByday,
        repeatBymonth: repeatBymonth + '',
        repeatBymonthday: repeatBymonthday + '',
        repeatStatus: value,
        repeatInterval: 1
      })
    },

    async setCustomRepeatChoose() {
      try {
        const result = await Router.toComponenteditcustomrepreat({
          data: {
            selectedDate: this.state.selectedDate,
            repeatInterval: this.state.repeatInterval,
            repeatType: this.state.repeatType,
            repeatByday: this.state.repeatByday,
            repeatBymonth: this.state.repeatBymonth,
            repeatBymonthday: this.state.repeatBymonthday
          }
        })
        if (!result) return
        const { repeatType, repeatInterval, selectedWeek, selectedMonthDay } = result
        if (!repeatType) return
        if (repeatType === 'DAILY') {
          this._custDaySelect(repeatInterval)
          return
        }
        if (repeatType === 'WEEKLY') {
          this._custWeeklySelect(repeatInterval, selectedWeek)
          return
        }

        if (repeatType === 'MONTHLY') {
          this._custMonthlySelect(repeatInterval, selectedMonthDay)
          return
        }
        this._custYearlySelect(repeatInterval)
      } catch (err) {
        console.log(err)
        Router.toIndex({ type: NavigateType.switchTab })
      }
    },

    /**
     * 自定义天重复
     * @param repeatInterval
     */
    _custDaySelect(repeatInterval: number) {
      this.setState({
        repeatStatus: repeatInterval === 1 ? '1' : '8',
        repeatInterval: repeatInterval,
        repeatType: 'DAILY'
      })
    },

    /**
     * 自定义周重复
     * @param repeatInterval
     * @param selectedWeek
     */
    _custWeeklySelect(repeatInterval: number, selectedWeek: Array<string>) {
      if (selectedWeek.length === 0) {
        selectedWeek.push(dayjs(this.state.selectedDate).day() + '')
      }
      const updateData = {
        repeatStatus: '8',
        repeatInterval: repeatInterval,
        repeatType: 'WEEKLY',
        repeatByday: ''
      }

      const joinArray: Array<string> = selectedWeek.map((i) => {
        return '0:' + i
      })
      updateData.repeatByday = joinArray.join(',')
      if (repeatInterval === 1 && (selectedWeek.length === 1 || selectedWeek.length === 2 || selectedWeek.length === 5)) {
        if (selectedWeek.length === 1 && selectedWeek[0] === '6') {
          updateData.repeatStatus = '4'
        } else if (
          selectedWeek.length === 2 &&
          ((selectedWeek[0] === '6' && selectedWeek[1] === '0') || (selectedWeek[0] === '0' && selectedWeek[1] === '6'))
        ) {
          updateData.repeatStatus = '3'
        } else if (selectedWeek.length === 5) {
          let weekDay = new Set(['1', '2', '3', '4', '5'])
          let selectedWeekDay = new Set(selectedWeek)
          let diff = new Set([...Array.from(weekDay)].filter((x) => !selectedWeekDay.has(x)))
          if (diff.size === 0) {
            updateData.repeatStatus = '2'
          }
        }
      }
      this.setState({ ...updateData })
    },

    /**
     * 自定义月重复
     * @param repeatInterval
     * @param selectedMonthDay
     */
    _custMonthlySelect(repeatInterval: number, selectedMonthDay: string) {
      const updateData = {
        repeatStatus: '8',
        repeatInterval: repeatInterval,
        repeatType: 'MONTHLY',
        repeatBymonthday: '',
        repeatByday: ''
      }
      if (selectedMonthDay) {
        if (selectedMonthDay === '1') {
          updateData.repeatBymonthday = dayjs(this.state.selectedDate).get('date') + ''
          if (repeatInterval === 1) {
            updateData.repeatStatus = '5'
          }
        } else {
          updateData.repeatByday = Math.ceil(this.state.selectedDate.getDate() / 7) + ':' + dayjs(this.state.selectedDate).day()
          if (repeatInterval === 1) {
            updateData.repeatStatus = '6'
          }
        }
      }
      this.setState({ ...updateData })
    },

    /**
     * 年自定义重复
     * @param repeatInterval
     */
    _custYearlySelect(repeatInterval: number) {
      const updateData = {
        repeatStatus: '8',
        repeatInterval: repeatInterval,
        repeatType: 'YEARLY',
        repeatBymonth: (dayjs(this.state.selectedDate).get('month') + 1).toString(),
        repeatBymonthday: dayjs(this.state.selectedDate).get('date').toString()
      }
      if (repeatInterval === 1) {
        updateData.repeatStatus = '7'
      }
      this.setState({ ...updateData })
    }
  },
  function ({ state, events }) {
    const { selectedDate, repeatStatus, repeatInterval, repeatType, repeatByday, repeatBymonth, repeatBymonthday } = state
    const { setRepeatChoose, setCustomRepeatChoose } = events
    return (
      <Container
        navTitle='循环选择'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-repeat-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='循环选择' left={true} to={1}></Header>
        }}
      >
        <RadioGroup className='van-page-box' value={repeatStatus} onChange={(e) => setRepeatChoose(e.detail)}>
          <CellGroup>
            <Cell title='不重复' className='no-repeat'>
              <Radio name='0' />
            </Cell>
            <Cell title='每天'>
              <Radio name='1' />
            </Cell>
            <Cell title='每周一至五'>
              <Radio name='2' />
            </Cell>
            <Cell title='每周六、周日'>
              <Radio name='3' />
            </Cell>
            <Cell title='每周（周六）'>
              <Radio name='4' />
            </Cell>
            <Cell title={`每月` + dayjs(selectedDate).format('（DD日）')}>
              <Radio name='5' />
            </Cell>
            <Cell title={`每月` + '（第' + Math.ceil(selectedDate.getDate() / 7) + '个' + dayjs(selectedDate).format('ddd') + '）'}>
              <Radio name='6' />
            </Cell>
            <Cell title={`每年（` + dayjs(selectedDate).format('MM月DD日）')}>
              <Radio name='7' />
            </Cell>
            <Cell
              className='custom'
              title='自定义'
              onClick={setCustomRepeatChoose}
              clickable
              label={repeatStatus === '8' && formatRepeatTime(repeatType, repeatStatus, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval)}
            >
              {repeatStatus === '8' && (
                <View>
                  <Icon name='success' color='blue' size='24px'></Icon>
                </View>
              )}
            </Cell>
          </CellGroup>
        </RadioGroup>
        <View className='van-page-button'>
          <Button block type='info'>
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
