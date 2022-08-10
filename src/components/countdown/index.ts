/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 17:12:57
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-10 18:28:09
 * @FilePath: \xut-calendar-vant-weapp\src\components\countdown\index.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { setTimeoutInterval, clearTimeoutInterval } from '@xdoer/timeout-interval'
import { CountDownOpt } from './types'
import { merge } from './util'

export default class CountDown {
  private opt: CountDownOpt
  private timerId: any = null
  private getNowTimeStamp: () => number
  now: number

  constructor(opt?: Partial<CountDownOpt>, getNowTimeStamp = () => Date.now()) {
    this.opt = merge({ interval: 1000, endTime: 0 }, opt)
    this.getNowTimeStamp = getNowTimeStamp
    this.now = getNowTimeStamp()
  }

  private useLocalTimeToCountDown() {
    let countdownSeconds = Math.round((this.opt.endTime - this.getNowTimeStamp()) / 1000)

    if (countdownSeconds < 0) return

    this.timerId = setTimeoutInterval(() => {
      this.opt.onStep?.(this.calculateTime(countdownSeconds * 1000))

      countdownSeconds--

      if (countdownSeconds < 0) {
        clearTimeoutInterval(this.timerId)
        return this.opt.onEnd?.()
      }
    }, this.opt.interval)
  }

  private calculateTime(ms: number) {
    const s = ms / 1000
    const m = s / 60
    const format = (v: number) => Number.parseInt('' + v, 10)

    return {
      d: format(m / 60 / 24),
      h: format((m / 60) % 24),
      m: format(m % 60),
      s: format(s % 60)
    }
  }

  start(h: number, m: number, s: number) {
    let endTime: Date = new Date()
    endTime.setHours(endTime.getHours() + h)
    endTime.setMinutes(endTime.getMinutes() + m)
    endTime.setSeconds(endTime.getSeconds() + s)
    this.opt.endTime = endTime.getTime()
    this.useLocalTimeToCountDown()
  }

  clean() {
    clearTimeoutInterval(this.timerId)
    this.timerId = null
  }
}
