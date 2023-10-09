/*
 * @Author: Derek Xu
 * @Date: 2023-10-09 16:42:28
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:52:33
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import $platform from './platform'
import $api from './api'
import $cache from './cache'
import $store from './store'
import $hooks from './hooks'

const calendar = {
  $platform,
  $api,
  $cache,
  $store,
  $hooks
}

export default calendar
