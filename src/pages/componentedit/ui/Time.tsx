/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-24 09:58:53
 * @LastEditTime: 2022-08-17 12:04:30
 * @LastEditors: Derek Xu
 */
import React from 'react'
import { Cell } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'

type IPageOption = {
  time: Date
  fullDay: number
  onClick: () => void
}

const Time: React.FC<IPageOption> = (props) => {
  const { fullDay, time } = props
  const day = dayjs(time).format('DD/MM/YYYY')
  const week = dayjs(time).format('ddd')
  const second = dayjs(time).format('HH:mm')
  return (
    <>
      {fullDay === 0 ? (
        <Cell clickable onClick={props.onClick}>
          <View className='time'>
            <View className='day-week'>
              <View className='day'>{day}</View>
              <View className='week'>{week}</View>
            </View>
            <View>{second}</View>
          </View>
        </Cell>
      ) : (
        <Cell clickable onClick={props.onClick}>
          <View className='time'>
            <View className='day-week'>
              <View>{day}</View>
              <View className='block'></View>
            </View>
            <View>{week}</View>
          </View>
        </Cell>
      )}
    </>
  )
}

export default Time
