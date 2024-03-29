/*
 * @Author: Derek Xu
 * @Date: 2022-05-25 15:12:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-08 10:43:41
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\component\DayEventListData.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 徐涛 jianhao2010303@163.com, All Rights Reserved.
 */
import { FunctionComponent } from 'react'
import { IDavComponent } from '~/../types/calendar'
import DayEventData from './DayEventData'

interface IPageOption {
  componentList: IDavComponent[]
  viewComponent: (component: IDavComponent) => void
}

const DayEventListData: FunctionComponent<IPageOption> = (props) => {
  const getWidth = () => {
    switch (props.componentList.length) {
      case 1:
        return 100
      case 2:
        return 50
      default:
        return 25
    }
  }

  return (
    <>
      {props.componentList.map((i, index) => {
        return <DayEventData key={index} width={getWidth()} color={i.color || '417ff9'} component={i} viewComponent={props.viewComponent}></DayEventData>
      })}
    </>
  )
}

export default DayEventListData
