/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-02 22:46:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-19 21:18:46
 */
import { ITouchEvent, View } from '@tarojs/components'
import { IDavCalendar } from '~/../types/calendar'
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
  const [checkValues, setCheckValues] = useState<string[]>([])

  useEffect(() => {
    const _showCalendars = props.calendars.filter((i) => i.display === 1)
    setShowCalendars(_showCalendars)
    setCheckValues(props.calendars.filter((i) => i.checked).map((i) => i.calendarId))
    console.log(checkValues)
  }, [props.calendars])

  const checkGroupChange = (value: string[]) => {
    props.selected(value)
  }

  return (
    <Popup className='pages-index-calendar_popup' show={props.open} position='top' style={{ height: '60%' }} onClose={props.closePopup} overlay>
      <View className='title'>我的日历</View>
      <View className='content'>
        {!props.hasLogin || showCalendars.length === 0 ? (
          <Empty description='~空空如也~' />
        ) : (
          <CheckboxGroup onChange={(e: ITouchEvent) => checkGroupChange(e.detail)} value={checkValues}>
            {showCalendars.map((item) => {
              return (
                <Cell key={item.id + ''} title={item.name}>
                  <Checkbox name={item.calendarId} checkedColor={`#${item.color}`}></Checkbox>
                </Cell>
              )
            })}
          </CheckboxGroup>
        )}
      </View>
      <View className='button'>
        {props.hasLogin && (
          <Button
            type='primary'
            block
            onClick={() => {
              props.closePopup()
              Router.toCalendaredit()
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
