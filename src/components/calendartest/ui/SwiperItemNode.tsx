/*
 * @Author: Derek Xu
 * @Date: 2023-02-07 15:15:19
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-02-07 17:55:46
 * @FilePath: \xut-calendar-vant-weapp\src\components\calendartest\ui\SwiperItemNode.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { SwiperItem, View, Text } from '@tarojs/components'
import classNames from 'classnames'
import { FC, useMemo } from 'react'

interface IPageState {
  shrinkType: Boolean
  selDate: CALENDAR.DAY
  days: any[]
  showBg: Boolean
}

const SwiperItemNode: FC<IPageState> = ({ showBg, shrinkType, selDate, days }) => {
  const _montBg = useMemo(() => {
    let monthBg = selDate.month
    return !shrinkType ? (monthBg < 10 ? '0' + monthBg : monthBg) : ''
  }, [shrinkType, selDate])

  const _getIsSelDay = useMemo(() => {
    return (d) => {
      let { year, month, day } = selDate
      return year == d.year && month == d.month && day == d.day
    }
  }, [selDate])

  return (
    <SwiperItem className='swiper-item swiper-prev-item'>
      {showBg && <View className='month-bg'>{_montBg}</View>}
      <View className={classNames('month-days', { ['item-week']: shrinkType })}>
        {days.map((b, j) => {
          return (
            <View className='week-days' key={j}>
              {b.map((c, k) => {
                return (
                  <View className='day' key={k}>
                    <View className={classNames('day-info', c.dayClass, { ['is-sel']: _getIsSelDay(c), ['un-month']: c.dayType != 'normal' })}>
                      <Text className='day-solar'>{c.day}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
    </SwiperItem>
  )
}

export default SwiperItemNode
