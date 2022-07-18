/*
 * @Author: Derek Xu
 * @Date: 2022-05-26 15:49:38
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-05-26 17:30:19
 * @FilePath: \xuct-calendar-weapp\src\pages\index\component\DayEventCurrent.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'

interface IPageOption {
  top: number
}

const DayEventCurrent: FunctionComponent<IPageOption> = (props) => {
  return (
    <View className='current' style={{ top: `${props.top}px` }}>
      <View className='circle'></View>
      <View className='line'></View>
    </View>
  )
}

export default DayEventCurrent
