/*
 * @Author: Derek Xu
 * @Date: 2023-10-13 14:35:47
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-13 18:05:23
 * @FilePath: \xut-calendar-vant-weapp\src\components\calendar\day\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import React, { FC } from 'react'
import solarLunar from 'solarlunar-es'
import { DayProps } from '../type'
import './index.less'

const Day: FC<DayProps> = (props) => {
  const {
    dateFormate,
    year,
    month,
    day,
    weekDay,
    disabled,
    notCurMonth = false,
    selected,
    hasMarker,
    selectedDateColor,
    isToday,
    onDayLongPress,
    onDayClick,
    custDayRender,
    mode
  } = props

  let dayClass = ''

  if (isToday) {
    dayClass += ' day-today'
  }
  if (selected) {
    dayClass += ' day-selected'
  }
  /** 日期被禁用的样式 */
  if (disabled) {
    dayClass += ' day-disabled'
  }
  /** 非本月的日期的样式 */
  if (notCurMonth) {
    dayClass += ' day-not-cur-month'
  }

  const _onLongPress = () => {
    if (!disabled) {
      onDayLongPress?.({ year, month, day, weekDay }, dateFormate)
    }
  }
  const _onClick = () => {
    if (!disabled) {
      onDayClick?.({ year, month, day, weekDay }, dateFormate)
    }
  }
  console.log(custDayRender, 'custDayRendercustDayRender')

  const lunarDayInfo: any = mode === 'lunar' ? solarLunar.lunar2solar(year, month, day, true) : null
  debugger
  const lunarClassName = ['lunar-day']
  if (lunarDayInfo) {
    if (lunarDayInfo.dayCn === '初一') {
      lunarClassName.push('lunar-month')
    }
  }

  return (
    <View onLongPress={_onLongPress} onClick={_onClick} className='day-wrapper'>
      {!custDayRender ? (
        <View className={dayClass} style={selected ? `backgroundColor: ${selectedDateColor}` : ''}>
          <View className='day-content'>
            {hasMarker && <View className='day-marker'></View>}
            <View>
              {/* 日期 */}
              {day}
            </View>
          </View>
          {/* <View className='day-extrainfo' style={extraInfo?.color ? `color: ${extraInfo.color}` : ``}>
            {extraInfo?.text}
          </View> */}
          {mode === 'normal' ? (
            ''
          ) : (
            <View className={lunarClassName.join(' ')}>
              {/* 农历 */}
              {(() => {
                if (!lunarDayInfo) {
                  return
                }
                let dateStr: string
                if (lunarDayInfo.dayCn === '初一') {
                  dateStr = lunarDayInfo.dayCn
                } else {
                  dateStr = lunarDayInfo.isTerm ? lunarDayInfo.term : lunarDayInfo.dayCn
                }
                return dateStr
              })()}
            </View>
          )}
        </View>
      ) : (
        custDayRender(props)
      )}
    </View>
  )
}

const areEquals = (preProps: DayProps, nextProps: DayProps) => {
  if (
    preProps.dateFormate === nextProps.dateFormate &&
    preProps.disabled === nextProps.disabled &&
    preProps.selected === nextProps.selected &&
    preProps.hasMarker === nextProps.hasMarker &&
    preProps.notCurMonth === nextProps.notCurMonth
  ) {
    return true
  }
  return false
}

export default React.memo(Day, areEquals)
