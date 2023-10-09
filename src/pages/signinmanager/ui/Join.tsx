/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 17:17:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 17:19:25
 * @FilePath: \xut-calendar-vant-weapp\src\pages\signinmanager\ui\Join.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'

interface IPageOption {
  type?: string
}

const Join: FC<IPageOption> = ({ type }) => {
  return <>{type}</>
}

export default Join
