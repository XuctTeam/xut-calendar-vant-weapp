/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-06 13:28:00
 * @LastEditTime: 2023-10-25 09:29:08
 * @LastEditors: Derek Xu
 */
import { Lunar } from 'lunar-typescript'

/**
 *
 * @param date 获取阴历日期
 * @returns
 */
export const lunarDay = (date: Date): any => {
  return Lunar.fromDate(date)
}
