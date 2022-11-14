/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-24 15:28:37
 * @LastEditTime: 2022-11-14 15:07:00
 * @LastEditors: Derek Xu
 */
import React from 'react'
import dayjs from 'dayjs'
import { View } from '@tarojs/components'
import { IDavComponent } from 'types/calendar'

interface IPageOption {
  component: IDavComponent
  viewComponent: (id: string) => void
}

const ComponentBody: React.FC<IPageOption> = (props) => {
  const { component } = props

  const view = () => {
    props.viewComponent(component.id)
  }

  return (
    <View className='component-body' hoverClass='component-body--hover' onClick={view}>
      <View className='event-label' style={{ color: `#${component.color}`, background: `#${component.color}` }}></View>
      <View className='event-content'>
        <View className='title'>{component.summary}</View>
        <View>{component.calendarName}</View>
        <View>
          {dayjs(component.dtstart).format('HH:mm') + '-' + dayjs(component.dtend).format('HH:mm') + (component.repeatStatus !== '0' ? '（周期）' : '')}
        </View>
      </View>
    </View>
  )
}
export default ComponentBody
