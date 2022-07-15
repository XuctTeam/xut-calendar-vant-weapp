/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-14 19:32:40
 * @FilePath: \temptaro\src\cache.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Cache from '@antmjs/cache'

// 和UI无关的全局数据存储在这里，和UI相关的全局数据存储在store.ts文件中

const {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
} = Cache({
  ram: {},
  loc: {
    sysInfo: undefined,
    menuButton: undefined,
    wxBrower: false,
    accessToken: '',
    refreshToken: '',
    userId: '',
    location: undefined,
  },
})

export {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
}
