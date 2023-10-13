/*
 * @Author: Derek Xu
 * @Date: 2023-10-13 14:35:47
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-13 17:55:01
 * @FilePath: \xut-calendar-vant-weapp\src\components\calendar\days\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import Day from '../Day'
import { matchDate, textFormat } from '../utils'
import './index.less'
import { DaysProps } from '../type'

const Days: FC<DaysProps> = (props) => {
  const { days = [], view, dayViewDetail, today, marks, minDate, maxDate, format, selectedDate, mode, extraInfo: extraInfoArr, ...restProps } = props

  return (
    <View className='days-wrapper'>
      {days.map((item) => {
        const dayProps: { [prop: string]: string | number | boolean } = { ...item }
        if (view === 'month') {
          // 如果非本月，则用颜色标记
          if (dayViewDetail.month !== item.month) {
            console.log(dayViewDetail.month, item.month)
            dayProps['notCurMonth'] = true
          }
        }
        const { year, month, day, weekDay } = item
        const dateFormate = textFormat({ year, month, day }, format!)
        dayProps['dateFormate'] = dateFormate
        /** 是否被选中 */
        const selected = dayjs(selectedDate).isSame(`${year}-${month}-${day}`)
        const hasMarker = !!marks?.find((ele) => dayjs(ele.value).isSame(dateFormate))
        /** 是否为当天 */
        const isToday = matchDate(today, { year, month, day })
        /** 禁止日期 */
        const disabled = dayjs(dateFormate) < dayjs(minDate) || dayjs(dateFormate) > dayjs(maxDate)

        const extraInfo = extraInfoArr?.find((ele) => dayjs(ele.value).isSame(dateFormate))
        const publicProps = {
          year,
          month,
          day,
          weekDay,
          selected,
          hasMarker,
          isToday,
          disabled,
          dateFormate,
          extraInfo,
          mode
        }
        return <Day key={dateFormate} {...dayProps} {...restProps} {...publicProps} />
      })}
    </View>
  )
}
export default Days
