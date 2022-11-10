/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 22:26:54
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 22:39:53
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Header.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { FC } from 'react'

interface IPageOption {
  selectedDay: string
  calendarPopOpen: () => void
}

const Header: FC<IPageOption> = (props) => {
  const { selectedDay, calendarPopOpen } = props
  return (
    <View className='page-index-header'>
      <View className='left'>
        <Icon
          classPrefix='page-icon'
          name='rili'
          size={50}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            calendarPopOpen()
          }}
        ></Icon>
        <View className='label'>{selectedDay}</View>
      </View>
      <View>sdfsdf</View>
    </View>
  )
}

export default Header
