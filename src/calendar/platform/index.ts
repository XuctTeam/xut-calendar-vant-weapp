/*
 * @Author: Derek Xu
 * @Date: 2023-10-09 16:52:30
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 13:21:56
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\platform\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
const provider = process.env.TARO_ENV
import { setSysInfoAsync } from '../utils'
import wechat from './provider/wechat'

// 加载当前平台前置行为
const load = () => {
  if (provider === 'weapp') {
    wechat.load()
  }
  setSysInfoAsync()
}

const platform = {
  load
}

export default platform
