/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 22:26:54
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 14:08:30
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Header.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { FC } from 'react'
import Router from 'tarojs-router-next'

interface IPageOption {
  selectedDay: string
  messageCount: number
  calendarPopOpen: () => void
}

const Header: FC<IPageOption> = (props) => {
  const { selectedDay, messageCount, calendarPopOpen } = props
  return (
    <View className='index-header'>
      <View className='left'>
        <Icon
          classPrefix='page-icon'
          name='rili'
          size={48}
          onClick={(e) => {
            e.preventDefault()
            calendarPopOpen()
          }}
        ></Icon>
        <View className='label'>{selectedDay}</View>
      </View>
      <View className='right'>
        <Icon color='#fff' name='search' size='24px' className='icon' onClick={() => Router.toComponentsearch()}></Icon>
        <Icon color='#fff' name='chat' size='24px' className='icon' dot={messageCount > 0} onClick={() => Router.toMessagemanager()}></Icon>
      </View>
    </View>
  )
}

export default Header
