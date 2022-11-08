/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-18 18:24:40
 * @LastEditTime: 2022-11-08 13:13:06
 * @LastEditors: Derek Xu
 */
import React from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { formatDifferentDayTime, formatRepeatTime } from '@/utils'

interface IPageOption {
  dtstart: Date
  dtend: Date
  fullDay: number
  repeatStatus?: string
  repeatType?: string
  repeatByday?: string
  repeatBymonth?: string
  repeatBymonthday?: string
  repeatInterval?: number
  repeatUntil?: string
}

const DifferentDay: React.FC<IPageOption> = (props) => {
  const {
    repeatStatus = '0',
    repeatType = '',
    repeatByday = '',
    repeatBymonth = '',
    repeatBymonthday = '',
    repeatInterval = 1,
    repeatUntil = dayjs().toDate()
  } = props

  return (
    <View className='date-time'>
      <View className='cell'>{formatDifferentDayTime(1, props.fullDay, props.dtstart)}</View>
      <View className='cell'>{formatDifferentDayTime(2, props.fullDay, props.dtend)}</View>
      {repeatStatus !== '0' && (
        <View className='cell'>
          {formatRepeatTime(repeatType, repeatStatus, repeatByday, repeatBymonth, repeatBymonthday, repeatInterval) +
            ',至 ' +
            dayjs(repeatUntil).format('YYYY-MM-DD')}
        </View>
      )}
    </View>
  )
}

export default DifferentDay
