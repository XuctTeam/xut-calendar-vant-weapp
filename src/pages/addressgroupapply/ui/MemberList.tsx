/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 11:09:43
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-19 21:18:17
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\ui\MemberList.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { Empty, Loading } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { IGroupMember } from 'types/group'
import MemberBody from './MemberBody'
import dayjs from 'dayjs'

interface IPageOption {
  loading: boolean
  active: number
  list: IGroupMember[]
  agreeJoin: (gmid: string) => void
  refuseJoin: (gmid: string) => void
  deleteApply: (gmid: string) => void
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
            <Empty description='~空空如也~' />
          ) : (
            props.list.map((item: IGroupMember, index: number) => {
              return (
                <MemberBody
                  key={index}
                  id={item.id}
                  avatar={item.avatar}
                  name={item.name}
                  groupName={item.groupName}
                  time={dayjs(item.createTime).format('YYYY/MM/DD')}
                  desc={''}
                  active={props.active}
                  agreeJoin={props.agreeJoin}
                  refuseJoin={props.refuseJoin}
                  deleteApply={props.deleteApply}
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
