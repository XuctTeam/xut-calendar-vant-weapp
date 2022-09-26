/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-26 18:35:51
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\component\DayEventData.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { IDavComponent } from '~/../types/calendar'
import dayjs from 'dayjs'

interface IPagOption {
  color: string
  component: IDavComponent
  viewComponent: (component: IDavComponent) => void
  width: number
}

const DayEventData: FunctionComponent<IPagOption> = (props) => {
  return (
    <View className='item-event-detail' style={{ width: `${props.width}%` }}>
      <View className='event-box' onClick={() => props.viewComponent(props.component)}>
        <View className='color' style={{ background: `#${props.color}` }}></View>
        <View className='content'>
          <View className='van-ellipsis title'>{props.component.summary}</View>
          <View>{dayjs(props.component.dtstart).format('HH:mm') + '-' + dayjs(props.component.dtend).format('HH:mm')}</View>
        </View>
      </View>
    </View>
  )
}

export default DayEventData
