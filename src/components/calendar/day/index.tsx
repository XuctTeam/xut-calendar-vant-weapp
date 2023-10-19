/*
 * @Author: Derek Xu
 * @Date: 2023-10-13 14:35:47
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 09:50:59
 * @FilePath: \xut-calendar-vant-weapp\src\components\calendar\Day\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import React, { FC } from 'react'
import lunisolar from 'lunisolar'
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
  console.log(custDayRender, 'custDayRenderCustDayRender')
  const lunarDayInfo: any = mode ? lunisolar(dateFormate) : null
  const lunarClassName = ['lunar-day']
  if (lunarDayInfo) {
    if (lunarDayInfo.lunar.getDayName() === '初一') {
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
          {!mode ? (
            ''
          ) : (
            <View className={lunarClassName.join(' ')}>
              {/* 农历 */}
              {(() => {
                if (!lunarDayInfo) {
                  return
                }
                let dateStr: string
                if (lunarDayInfo.lunar.getDayName() === '初一') {
                  dateStr = lunarDayInfo.lunar.getDayName()
                } else {
                  dateStr = lunarDayInfo.solarTerm ? lunarDayInfo.solarTerm.toString() : lunarDayInfo.lunar.getDayName()
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
    preProps.notCurMonth === nextProps.notCurMonth &&
    preProps.mode === nextProps.mode
  ) {
    return true
  }
  return false
}

// eslint-disable-next-line import/no-named-as-default-member
export default React.memo(Day, areEquals)
