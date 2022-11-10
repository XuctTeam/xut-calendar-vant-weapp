/*
 * @Author: Derek Xu
 * @Date: 2022-08-14 11:26:00
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 08:56:33
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmember\ui\MemberList.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { IGroupMember } from 'types/group'
import Member from './Member'

interface IPageOption {
  charCode: string
  members: IGroupMember[]
  selected: (groupId: string, memberId: string) => void
}

const MemberList: FC<IPageOption> = (props) => {
  return (
    <>
      {props.members.map((item, index) => {
        return <Member key={index} groupId={item.groupId} id={item.memberId} name={item.name} avatar={item.avatar} selected={props.selected}></Member>
      })}
    </>
  )
}

export default MemberList
