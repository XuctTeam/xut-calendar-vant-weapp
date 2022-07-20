/*
 * @Author: Derek Xu
 * @Date: 2022-07-20 12:01:11
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-20 13:15:47
 * @FilePath: \xut-calendar-vant-weapp\src\styles\prefix.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
const COMPONENT_PREFIX = 'van-'

export function prefixClassname(component: string) {
  return `${COMPONENT_PREFIX}${component}`
}
