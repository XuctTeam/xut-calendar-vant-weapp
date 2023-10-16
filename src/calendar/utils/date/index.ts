/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-06 13:28:00
 * @LastEditTime: 2023-10-16 09:00:09
 * @LastEditors: Derek Xu
 */
import lunisolar from 'lunisolar'

/**
 *
 * @param date 获取阴历日期
 * @returns
 */
export const lunarDay = (date: Date | string): any => {
  return lunisolar(date)
}
