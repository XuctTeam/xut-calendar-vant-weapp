/*
 * @Author: Derek Xu
 * @Date: 2022-08-17 14:06:18
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 18:01:36
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\ui\CalendarAction.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { ActionSheet } from '@antmjs/vantui'
import { ITouchEvent } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import { IDavCalendar } from 'types/calendar'

interface IPageOption {
  show: boolean
  onClose: () => void
  onSelect: (id: string) => void
  calendars: IDavCalendar[]
}

const CalendarAction: FC<IPageOption> = (props) => {
  const { calendars, show } = props
  const [actions, setActions] = useState<any[]>()

  useEffect(() => {
    const _action = calendars.map((item) => {
      return {
        name: item.name,
        color: '#' + item.color,
        value: item.id
      }
    })
    setActions(_action)
  }, [props.calendars])

  return (
    <ActionSheet
      show={show}
      actions={actions}
      onCancel={props.onClose}
      cancelText='取消'
      onClose={props.onClose}
      onSelect={(e: ITouchEvent) => {
        props.onSelect(e.detail.value)
      }}
    />
  )
}

export default CalendarAction
