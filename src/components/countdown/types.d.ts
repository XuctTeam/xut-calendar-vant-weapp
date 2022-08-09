/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 17:23:04
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-09 17:32:37
 * @FilePath: \xut-calendar-vant-weapp\src\components\countdown\types.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
export interface CountDownDateMeta {
  d: number
  h: number
  m: number
  s: number
}

export interface IStep {
  counter: number
  diff: number
}

export interface CountDownOpt {
  interval: number
  endTime: number
  onStep?(value: IStep): void
  onEnd?(): void
}
