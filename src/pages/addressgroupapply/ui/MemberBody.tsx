/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 11:03:42
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 11:07:08
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\ui\MemberBody.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Cell } from '@antmjs/vantui'
import { FC } from 'react'

interface IPageOption {
  groupName: string
  time: string
  desc: string
}

const MemberBody: FC<IPageOption> = (props) => {
  return <Cell title={props.groupName} value={props.time} label={props.desc} />
}

export default MemberBody
