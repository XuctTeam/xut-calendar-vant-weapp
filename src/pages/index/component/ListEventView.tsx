/*
 * @Author: Derek Xu
 * @Date: 2022-05-25 10:23:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-18 14:41:26
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\component\ListEventView.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { Col, Row } from '@antmjs/vantui'
import dayjs from 'dayjs'
import ListEventData from './ListEventData'
import { IDavComponent } from '~/../@types/calendar'

interface IPageOption {
  selectedDay: string
  componentList: IDavComponent[]
  today: string
  viewComponent: (component: IDavComponent) => void
  currentTime: number
}

const ListEventView: FunctionComponent<IPageOption> = (props) => {
  return (
    <Row>
      <Col span={4} className='week-day'>
        <View className='day'>{dayjs(props.selectedDay).format('DD')}</View>
        <View className='week'>{dayjs(props.selectedDay).format('ddd')}</View>
      </Col>
      <Col span={20} className='event-list-content'>
        {props.componentList.map((component, i) => {
          return (
            <ListEventData
              key={i}
              component={component}
              viewComponent={props.viewComponent}
              selecteday={props.selectedDay}
              today={props.today}
              current={props.currentTime}
            ></ListEventData>
          )
        })}
      </Col>
    </Row>
  )
}

export default ListEventView
