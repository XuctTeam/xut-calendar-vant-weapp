/*
 * @Author: Derek Xu
 * @Date: 2022-08-14 11:26:00
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-14 11:36:39
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
}

const MemberList: FC<IPageOption> = (props) => {
  return (
    <>
      {props.members.map((item, index) => {
        return <Member key={index} name={item.name}></Member>
      })}
    </>
  )
}

export default MemberList
