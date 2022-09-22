/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-02 22:46:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-22 15:53:34
 */
import Router from 'tarojs-router-next'
import { ITouchEvent, View } from '@tarojs/components'
import { IDavCalendar } from '~/../types/calendar'
import { useEffect, useState } from 'react'
import { Cell, Checkbox, CheckboxGroup, Empty, Icon, Popup, Image } from '@antmjs/vantui'
import Avatar from '@/components/avatar'
import Logo from '@/assets/logo.png'

interface IPageOption {
  calendars: Array<IDavCalendar>
  open: boolean
  hasLogin: boolean
  avatar: string | undefined
  name: string
  phone: string | undefined
  closePopup: () => void
  selected: (value: string[]) => void
}

const CalendarPop: React.FC<IPageOption> = (props) => {
  const [showCalendars, setShowCalendars] = useState<IDavCalendar[]>([])
  const [checkValues, setCheckValues] = useState<string[]>([])
  const { avatar, name, hasLogin, phone } = props

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
      {!hasLogin ? (
        <Empty description='暂未登录' />
      ) : (
        <View className='pop-box'>
          <View class='user-info'>
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
