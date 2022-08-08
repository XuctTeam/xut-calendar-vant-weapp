/*
 * @Author: Derek Xu
 * @Date: 2022-05-26 09:59:14
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-05-26 10:33:11
 * @FilePath: \xuct-calendar-weapp\src\pages\index\component\DayEventFullDay.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { IDavComponent } from '~/../types/calendar'

interface IPageOption {
  componentList: IDavComponent[]
  viewComponent: (component: IDavComponent) => void
}

const DayEventFullDay: FunctionComponent<IPageOption> = (props) => {
  return (
    <View className="full-day taroify-hairline--bottom">
      <View className="title">全天</View>
      <View className="list">
        {props.componentList.map((i, index) => {
          return (
            <View
              key={index}
              className="box"
              onClick={() => props.viewComponent(i)}
            >
              <View
                className="color"
                style={{ background: `#${i.color}` }}
              ></View>
              <View className="content">
                <View className="title taroify-ellipsis">{i.summary}</View>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default DayEventFullDay
