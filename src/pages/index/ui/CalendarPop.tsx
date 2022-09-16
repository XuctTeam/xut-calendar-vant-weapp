/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-02 22:46:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-16 17:51:38
 */
import { ITouchEvent, View } from '@tarojs/components'
import { IDavCalendar } from '~/../types/calendar'
import { useEffect, useState } from 'react'
import Router from 'tarojs-router-next'
import { Button, Cell, CellGroup, Checkbox, CheckboxGroup, Popup } from '@antmjs/vantui'

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
    <Popup
      className='pages-index-calendar_popup'
      show={props.open}
      position='left'
      safeAreaInsetTop
      style={{ height: '100%', width: '80%' }}
      zIndex={999}
      onClose={props.closePopup}
      overlay
    >
      <View className='box'>
        <CellGroup title='我' className='li'>
          <View>123123</View>
          <View>234234</View>
        </CellGroup>
        <CellGroup title='日历' className='li'>
          <CheckboxGroup onChange={(e: ITouchEvent) => checkGroupChange(e.detail)} value={checkValues}>
            {showCalendars.map((item) => {
              return (
                <Cell key={item.id + ''} title={item.name}>
                  <Checkbox name={item.calendarId} checkedColor={`#${item.color}`}></Checkbox>
                </Cell>
              )
            })}
          </CheckboxGroup>
        </CellGroup>

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
      </View>
    </Popup>
  )
}
export default CalendarPop
