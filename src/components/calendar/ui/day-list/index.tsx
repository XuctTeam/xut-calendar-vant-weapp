/*
 * @Author: Derek Xu
 * @Date: 2023-10-24 18:08:44
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-25 09:08:09
 * @FilePath: \xut-calendar-vant-weapp\src\components\calendar\ui\day-list\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import React from 'react'
import { View } from '@tarojs/components'

interface IPageOption {
  monday: boolean
}

export default class AtCalendarHeader extends React.Component<IPageOption> {
  public render(): JSX.Element {
    return (
      <View className='at-calendar__header header'>
        <View className='header__flex'>
          {!this.props.monday && <View className='header__flex-item'>日</View>}
          <View className='header__flex-item'>一</View>
          <View className='header__flex-item'>二</View>
          <View className='header__flex-item'>三</View>
          <View className='header__flex-item'>四</View>
          <View className='header__flex-item'>五</View>
          <View className='header__flex-item'>六</View>
          {this.props.monday && <View className='header__flex-item'>日</View>}
        </View>
      </View>
    )
  }
}
