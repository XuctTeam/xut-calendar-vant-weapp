/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 17:16:13
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 17:39:12
 * @FilePath: \xut-calendar-vant-weapp\src\pages\signinmanager\ui\Mine.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, PowerScrollView } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { FC } from 'react'
import { ISign } from 'types/sign'

interface IPageOption {
  finished: boolean
  signlist: ISign[]
}

const Mine: FC<IPageOption> = (props) => {
  const { finished, signlist } = props

  return (
    <View className='box'>
      <Button plain block type='warning'>
        新建
      </Button>
      <PowerScrollView finishedText='--- 我是有底线的 ---' emptyDescription='空空如也~' finished={finished} current={signlist.length}>
        <></>
      </PowerScrollView>
    </View>
  )
}

export default Mine
