/*
 * @Author: Derek Xu
 * @Date: 2022-04-20 16:06:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-08 14:55:25
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentshareview\ui\SameDay.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-18 18:02:45
 * @LastEditTime: 2022-03-01 14:35:47
 * @LastEditors: Derek Xu
 */
import React from 'react'
import { View } from '@tarojs/components'
import { formateSameDayDuration, formatRepeatTime, formatSameDayTime } from '@/utils'

interface IPageOption {
  dtstart: Date
  dtend: Date
  fullDay: number
  repeatStatus: string
  repeatType: string
  repeatByday: string
  repeatBymonth: string
  repeatBymonthday: string
  repeatInterval: number
  repeatUntil?: string
}

const RepeatTime: React.FC<IPageOption> = (props) => {
  const { dtstart, dtend, fullDay, repeatStatus, repeatType, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval } = props
  return (
    <>
      <View>{formatSameDayTime(fullDay, dtstart, dtend)}</View>
      <View className='same-day'>
        <View>{formateSameDayDuration(fullDay, dtstart, dtend)}</View>
        {repeatStatus !== '0' && (
          <View className='repeat'>{formatRepeatTime(repeatType, repeatStatus, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval)}</View>
        )}
      </View>
    </>
  )
}

export default RepeatTime
