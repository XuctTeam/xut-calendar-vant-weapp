/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-02 22:46:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-18 14:34:23
 */
import { View } from '@tarojs/components'
import { IDavCalendar } from '~/../@types/calendar'
import { useEffect, useState } from 'react'
import Router from 'tarojs-router-next'
import { Button, Cell, Checkbox, CheckboxGroup, Empty, Popup } from '@antmjs/vantui'

interface IPageOption {
  calendars: Array<IDavCalendar>
  open: boolean
  hasLogin: boolean
  closePopup: () => void
  selected: (value: string[]) => void
}

const CalendarPop: React.FC<IPageOption> = (props) => {
  const [showCalendars, setShowCalendars] = useState<IDavCalendar[]>([])

  useEffect(() => {
    const _showCalendars = props.calendars.filter((i) => i.display === 1)
    setShowCalendars(_showCalendars)
  }, [props.calendars])

  const checkGroupChange = (value: string[]) => {
    props.selected(value)
  }

  return (
    <Popup className='pages-index-calendar_popup' show={props.open} position='top' style={{ height: '70%' }} onClose={props.closePopup} overlay>
      <View className='title'>我的日历</View>
      <View className='content'>
        {!props.hasLogin || showCalendars.length === 0 ? (
          <Empty description='暂无数据' />
        ) : (
          <CheckboxGroup onChange={(e) => checkGroupChange(e.detail.value)}>
            {showCalendars.map((item) => {
              return (
                <Cell key={item.id + ''} title={item.name}>
                  <Checkbox name={item.calendarId + ''} value={item.checked} checkedColor={`#${item.color}`}></Checkbox>
                </Cell>
              )
            })}
          </CheckboxGroup>
        )}
      </View>
      <View className='button'>
        {props.hasLogin && (
          <Button
            color='primary'
            block
            onClick={() => {
              props.closePopup()
              //Router.toCalendarcreate()
            }}
          >
            新增日历
          </Button>
        )}
      </View>
    </Popup>
  )
}
export default CalendarPop
