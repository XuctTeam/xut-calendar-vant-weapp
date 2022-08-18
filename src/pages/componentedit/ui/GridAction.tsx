/*
 * @Author: Derek Xu
 * @Date: 2022-08-17 16:56:14
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-18 09:46:33
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\ui\GridAction.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { FC } from 'react'
import { Grid, GridItem } from '@antmjs/vantui'
import { View } from '@tarojs/components'

interface IPageOption {
  repeatStatus: string
  place: string
  description: string
  setPlaceChoose: () => void
  setDescriptionChoose: () => void
  setRepeatChoose: () => void
}

const GridAction: FC<IPageOption> = (props) => {
  const { repeatStatus, place, description } = props

  return (
    <Grid gutter={10} columnNum={4} className='action'>
      {[1, 2, 3, 4].map((item) => {
        switch (item) {
          case 1:
            return repeatStatus === '0' ? <GridItem key={item} icon='replay' text='重复' onClick={props.setRepeatChoose} /> : <View key={item}></View>
          case 2:
            return !place ? <GridItem key={item} icon='location-o' text='地点' onClick={props.setPlaceChoose} /> : <View key={item}></View>
          case 3:
            return !description ? <GridItem key={item} icon='description' text='备注' onClick={props.setDescriptionChoose} /> : <View key={item}></View>
          default:
            return <GridItem key={item} icon='photo-o' text='附件' />
        }
      })}
    </Grid>
  )
}

export default GridAction
