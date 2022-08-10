/*
 * @Author: Derek Xu
 * @Date: 2022-08-10 21:04:55
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-10 21:10:15
 * @FilePath: \xut-calendar-vant-weapp\src\utils\countdown\index.ts
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import CountDown from './CountDown'
import { CountDownDateMeta } from './types'

const create = (endTime: number, stepCall: (value: CountDownDateMeta) => void, endCall: () => void) => {
  return new CountDown({
    endTime,
    onStep({ d, h, m, s }) {
      stepCall({ d, h, m, s })
    },
    onEnd() {
      endCall()
    }
  })
}

export { create }
