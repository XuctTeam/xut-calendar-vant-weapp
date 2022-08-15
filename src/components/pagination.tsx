/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 18:32:41
 * @FilePath: \xut-calendar-vant-weapp\src\components\pagination.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View, Image } from '@tarojs/components'
import { Empty } from '@antmjs/vantui'
import './pagination.less'
import { ReactNode } from 'react'

interface IPropsModel {
  complete: boolean
  data: any[]
  loading: boolean
  children: ReactNode
}

function Index(props: IPropsModel): JSX.Element {
  return (
    <View className='components-pagination' style={{ height: '100%' }}>
      {props.children}
      {!props.complete && props.data && props.loading ? (
        <View className='components-mum'>
          <Image className='image' src='https://g.18qjz.cn/img/static/124w_124h_63CAA1498816035.gif' mode='aspectFill' />
        </View>
      ) : props.data && props.data.length === 0 ? (
        <View className='no-data-search'>
          <Empty image='search' description='空空如也' />
        </View>
      ) : (
        <View />
      )}
      {props.complete && props.data.length !== 0 && <View className='view__finished-text'>~已经到底了~</View>}
    </View>
  )
}

export default Index
