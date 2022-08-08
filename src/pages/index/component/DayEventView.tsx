/*
 * @Author: Derek Xu
 * @Date: 2022-05-25 10:31:59
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-05-26 18:12:35
 * @FilePath: \xuct-calendar-weapp\src\pages\index\component\DayEventView.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent, useEffect, useState } from 'react'
import { ScrollView, View } from '@tarojs/components'
import { IDavComponent } from '~/../types/calendar'
import dayjs from 'dayjs'
import DayEventListData from './DayEventListData'
import DayEventFullDay from './DayEventFullDay'
import DayEventCurrent from './DayEventCurrent'
import Taro from '@tarojs/taro'

interface IPageOption {
  selectedDay: string
  componentList: IDavComponent[]
  today: string
  viewComponent: (component: IDavComponent) => void
  currentTime: number
}

const DayEventView: FunctionComponent<IPageOption> = (props) => {
  const [timeMap, setTimeMap] = useState<Map<string, IDavComponent[]>>()
  const [fullDayList, setFullDayList] = useState<IDavComponent[]>([])
  const [top, setTop] = useState<number>(0)

  useEffect(() => {
    _fillTimeMap(props.componentList)
    _fillAllDayList(props.componentList)
    _fillTop()
  }, [props.componentList])

  const _fillTimeMap = (list: IDavComponent[]) => {
    const map = new Map<string, IDavComponent[]>()
    list
      .filter((c) => c.fullDay === 0)
      .forEach((c) => {
        const _time = dayjs(c.dtstart).hour()
        const _key = _time > 10 ? _time + ':00' : '0' + _time + ':00'
        if (map.has(_key)) {
          map.get(_key)?.push(c)
          return
        }
        map.set(_key, [c])
      })
    console.log(map)
    setTimeMap(map)
  }

  /**
   * @description: 筛选全天事件
   * @param {IDavComponent} list
   * @return {*}
   */
  const _fillAllDayList = (list: IDavComponent[]) => {
    setFullDayList(list.filter((c) => c.fullDay === 1))
  }

  const _fillTop = () => {
    const time = dayjs()
    const hour = time.hour() + 1
    Taro.createSelectorQuery()
      .select('#day-event-id-' + hour)
      .boundingClientRect((res) => {
        if (!res) {
          setTimeout(() => {
            _fillTop()
          }, 200)
          return
        }
        const height =
          res.height * (hour - 1) +
          10 +
          time.minute() * parseInt(res.height / 60 + '')
        console.log(height)
        setTop(height)
      })
      .exec()
  }

  return (
    <View className="day-event-list">
      {fullDayList.length !== 0 && (
        <DayEventFullDay
          componentList={fullDayList}
          viewComponent={props.viewComponent}
        ></DayEventFullDay>
      )}
      <View className="event-list">
        {Array.from({ length: 24 }, (v, k) => k).map((i, index) => {
          return (
            <View className="item" key={index} id={`day-event-id-${i}`}>
              <View className="time-line">
                <View className="timer">{i < 10 ? `0${i}:00` : `${i}:00`}</View>
                <View className="line"></View>
              </View>
              <ScrollView className="item-event" scrollX scrollWithAnimation>
                <DayEventListData
                  componentList={
                    !timeMap
                      ? []
                      : timeMap.get(i < 10 ? `0${i}:00` : `${i}:00`) || []
                  }
                  viewComponent={props.viewComponent}
                ></DayEventListData>
              </ScrollView>
            </View>
          )
        })}
        <DayEventCurrent top={top}></DayEventCurrent>
      </View>
    </View>
  )
}

export default DayEventView
