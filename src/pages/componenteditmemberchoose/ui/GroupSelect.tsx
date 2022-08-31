/*
 * @Author: Derek Xu
 * @Date: 2022-08-29 17:44:02
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-31 17:22:51
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmemberchoose\ui\GroupSelect.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import Avatar from '@/components/avatar'
import { View } from '@tarojs/components'

interface IPageOption {
  id: string
  name: string
  images: string
  count: number
  onClick: (id: string) => void
}

const GroupSelect: FC<IPageOption> = (props) => {
  const { id, images, name, count } = props
  return (
    <View className='li' hoverClass='li--hover hover-class' hoverStayTime={70} onClick={() => props.onClick(id)}>
      {images ? (
        <Avatar src={images} size='medium'></Avatar>
      ) : (
        <Avatar className='avatar' size='medium'>
          G
        </Avatar>
      )}
      <View className='label'>
        <View>{name}</View>
        <View className='count'>{`共 ${count} 人`}</View>
      </View>
    </View>
  )
}

export default GroupSelect
