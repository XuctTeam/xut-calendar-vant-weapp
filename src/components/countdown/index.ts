/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 17:12:57
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-09 18:06:11
 * @FilePath: \xut-calendar-vant-weapp\src\components\countdown\index.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { CountDownOpt } from './types'

export default class CountDown {
  private opt: CountDownOpt
  private timerId: any = null
  private getNowTimeStamp: () => number
  now: number

  constructor(opt?: Partial<CountDownOpt>, getNowTimeStamp = () => Date.now()) {
    this.opt = Object.assign({ interval: 1000, endTime: 0 }, opt)
    this.getNowTimeStamp = getNowTimeStamp
    this.now = getNowTimeStamp()
  }

  begin() {
    const that = this
    let speed = 1000,
      counter = 0,
      start = this.getNowTimeStamp()
    function instance() {
      if (that.opt.endTime > 0 && new Date().getTime() > that.opt.endTime) {
        return that.end()
      }
      let ideal = counter * speed,
        real = new Date().getTime() - start
      counter++
      if (counter === that.opt.interval) {
        return that.end()
      }
      that.opt.onStep?.({
        counter: counter,
        diff: that.opt.interval - counter
      })
      let diff = real - ideal
      that.timerId = window.setTimeout(function () {
        instance()
      }, speed - diff) // 通过系统时间进行修复
    }
    that.timerId = window.setTimeout(function () {
      instance()
    }, speed)
  }

  end() {
    this.clean()
    return this.opt.onEnd?.()
  }

  clean() {
    if (this.timerId) {
      window.clearTimeout(this.timerId)
    }
  }

  reset() {
    this.now = this.getNowTimeStamp()
    this.begin()
  }
}
