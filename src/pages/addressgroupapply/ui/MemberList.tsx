/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 11:09:43
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 22:59:28
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\ui\MemberList.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import React, { FC } from 'react'
import { Empty, Loading } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { IGroupMember } from 'types/group'
import MemberBody from './MemberBody'
import dayjs from 'dayjs'

interface IPageOption {
  loading: boolean
  list: IGroupMember[]
}

const MemberList: FC<IPageOption> = (props) => {
  return (
    <>
      {props.loading ? (
        <View className='loading'>
          <Loading size='24px'>加载中...</Loading>
        </View>
      ) : (
        <>
          {props.list.length === 0 ? (
            <Empty description='暂无数据' />
          ) : (
            props.list.map((item: IGroupMember, index: number) => {
              return (
                <MemberBody
                  key={index}
                  avatar={item.avatar}
                  name={item.name}
                  groupName={item.groupName}
                  time={dayjs(item.createTime).format('YYYY/MM/DD')}
                  desc={''}
                ></MemberBody>
              )
            })
          )}
        </>
      )}
    </>
  )
}

export default MemberList
