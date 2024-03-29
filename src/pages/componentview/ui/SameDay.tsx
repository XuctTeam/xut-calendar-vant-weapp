/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-18 18:02:45
 * @LastEditTime: 2022-11-08 14:55:38
 * @LastEditors: Derek Xu
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { formatSameDayTime, formateSameDayDuration, formatRepeatTime } from '@/calendar/utils'

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

const RepeatTime: FunctionComponent<IPageOption> = (props) => {
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
