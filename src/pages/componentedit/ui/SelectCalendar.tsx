/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-23 15:18:47
 * @LastEditTime: 2022-08-17 14:23:33
 * @LastEditors: Derek Xu
 */
import { View } from '@tarojs/components'
import { FC } from 'react'

type IPageOption = {
  color: string
  title: string
}

const SelectCalendar: FC<IPageOption> = (props) => {
  return (
    <View className='selected-calendar'>
      <View className='circle' style={{ backgroundColor: `#${props.color}` }}></View>
      <View>{props.title}</View>
    </View>
  )
}
export default SelectCalendar
