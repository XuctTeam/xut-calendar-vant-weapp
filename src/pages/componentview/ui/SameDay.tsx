/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-18 18:02:45
 * @LastEditTime: 2022-09-23 13:58:22
 * @LastEditors: Derek Xu
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { formatSameDayTime, formateSameDayDuration } from '@/utils'

interface IPageOption {
  dtstart: Date
  dtend: Date
  fullDay: number
}

const RepeatTime: FunctionComponent<IPageOption> = (props) => {
  return (
    <View className='date-time'>
      <View className='cell'>{formatSameDayTime(props.fullDay, props.dtstart, props.dtend)}</View>
      <View className='cell'>{formateSameDayDuration(props.fullDay, props.dtstart, props.dtend)}</View>
    </View>
  )
}

export default RepeatTime
