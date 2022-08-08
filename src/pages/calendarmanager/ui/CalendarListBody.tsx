/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-07 10:37:56
 * @LastEditTime: 2022-08-08 15:25:48
 * @LastEditors: Derek Xu
 */
import React from 'react'
import { View } from '@tarojs/components'
import { IDavCalendar } from '~/../types/calendar'
import { Col, Icon, Row } from '@antmjs/vantui'

interface IPageOption {
  item: IDavCalendar
  editCalendar: (id: string) => void
}

const CalendarListBody: React.FC<IPageOption> = (props) => {
  const { id, name, color, description, createMemberName } = props.item || {
    id: '',
  }
  return (
    <>
      <View className="header">
        <Row>
          <Col span={3}>
            <View className="color">
              <View
                className="square"
                style={{ background: `#${color}` }}
              ></View>
            </View>
          </Col>
          <Col span={18} className="title">
            {name}
          </Col>
          <Col span={3}>
            <Icon name="edit" onClick={() => props.editCalendar(id)} />
          </Col>
        </Row>
      </View>
      <View className="content">
        <View className="mark taroify-ellipsis--l3">
          日历描述: {description}
        </View>
        <View className="ower">拥有者: {createMemberName}</View>
      </View>
    </>
  )
}

export default CalendarListBody
