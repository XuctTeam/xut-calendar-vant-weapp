/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 16:47:10
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\cache\cache.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Cache from '@antmjs/cache'

// 和UI无关的全局数据存储在这里，和UI相关的全局数据存储在store.ts文件中

const { cacheGetSync, cacheGet, cacheSetSync, cacheSet, cacheRemoveSync, cacheRemove } = Cache({
  ram: {},
  loc: {
    sysInfo: undefined,
    menuButton: undefined,
    userId: '',
    location: undefined,
    accessToken: '',
    refreshToken: '',
    lunarView: false,
    mondayView: false,
    compView: 'day'
  }
})

export { cacheGetSync, cacheGet, cacheSetSync, cacheSet, cacheRemoveSync, cacheRemove }
