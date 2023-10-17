/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 22:26:54
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-17 18:07:03
 * @FilePath: \xut-calendar-vant-weapp\src\pages\index\ui\Header.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { Icon } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { FC, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ButtonGroup from '@/components/buttongroup'
import calendar from '@/calendar'

interface IPageOption {
  selectedDay: string
  calendarPopOpen: () => void
}

const Header: FC<IPageOption> = ({ selectedDay, calendarPopOpen }) => {
  const menusButtons = [
    { name: '月', value: 0, key: 'month' },
    { name: '周', value: 1, key: 'week' }
  ]
  const calendarView = useRecoilValue(calendar.$store.compViewStore)
  const [active, setActive] = useState<number>(menusButtons.find((item) => item.key === calendarView)?.value ?? 0)
  const setCalendarView = useSetRecoilState(calendar.$store.compViewStore)

  return (
    <View className='index-header'>
      <View className='left'>
        <Icon
          name='wap-nav'
          size={48}
          onClick={(e) => {
            e.preventDefault()
            calendarPopOpen()
          }}
        ></Icon>
        <View className='label'>{selectedDay}</View>
      </View>
      <View className='right'>
        <ButtonGroup
          active={active}
          buttons={menusButtons}
          type='info'
          size='small'
          onClick={(e: number) => {
            if (e !== active) {
              setActive(e)
              setCalendarView(menusButtons[e]?.key ?? 'month')
            }
          }}
        ></ButtonGroup>
      </View>
    </View>
  )
}

export default Header
