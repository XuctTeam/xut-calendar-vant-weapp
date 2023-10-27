/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-02 22:46:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-26 08:32:53
 */
import Router from 'tarojs-router-next'
import { ITouchEvent, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Cell, Checkbox, CheckboxGroup, Empty, Icon, Popup, Image } from '@antmjs/vantui'
import Avatar from '@/components/avatar'
import { Calendar } from '@/calendar/api/interface'

interface IPageOption {
  calendars: Calendar.IDavCalendar[]
  open: boolean
  hasLogin: boolean
  avatar: string | undefined
  name: string
  phone: string | undefined
  closePopup: () => void
  selected: (value: string[]) => void
}

const Logo = require('@/assets/logo.png')

const CalendarPop: React.FC<IPageOption> = ({ calendars = [], open = false, avatar, name, hasLogin, phone, closePopup, selected }) => {
  const [showCalendars, setShowCalendars] = useState<Calendar.IDavCalendar[]>([])
  const [checkValues, setCheckValues] = useState<string[]>([])

  useEffect(() => {
    const _showCalendars = calendars.filter((i) => i.display === 1)
    setShowCalendars(_showCalendars)
    setCheckValues(calendars.filter((i) => i.checked).map((i) => i.calendarId))
    console.log(checkValues)
  }, [calendars])

  const checkGroupChange = (value: string[]) => {
    selected(value)
  }

  return (
    <Popup
      className='pages-index-calendar_popup'
      show={open}
      position='left'
      safeAreaInsetTop
      style={{ height: '100%', width: '80%' }}
      zIndex={999}
      onClose={closePopup}
      overlay
    >
      {!hasLogin ? (
        <Empty description='暂未登录' />
      ) : (
        <View className='pop-box'>
          <View className='user-info'>
            <Avatar src={avatar} style={{ width: '50px', height: '50px' }}></Avatar>
            <View className='name'>
              <View>{name}</View>
              <View>{phone || '暂未绑定手机'}</View>
            </View>
          </View>
          <View className='li logo'>
            <Image round width='40px' height='40px' src={Logo} />
            <View className='notice'>
              <View>关注公主号</View>
              <View>才能获得消息提醒哦~</View>
            </View>
          </View>
          <View className='title'>
            <View>日历</View>
            <Icon
              classPrefix='page-icon'
              name='tianjia'
              size='24px'
              className='icon'
              onClick={() => {
                Router.toCalendaredit()
              }}
            ></Icon>
          </View>
          <View className='li'>
            <CheckboxGroup onChange={(e: ITouchEvent) => checkGroupChange(e.detail)} value={checkValues}>
              {showCalendars.map((item) => {
                return (
                  <Cell key={item.id + ''} title={item.name}>
                    <Checkbox name={item.calendarId} checkedColor={`#${item.color}`}></Checkbox>
                  </Cell>
                )
              })}
            </CheckboxGroup>
          </View>
        </View>
      )}
    </Popup>
  )
}

export default CalendarPop
