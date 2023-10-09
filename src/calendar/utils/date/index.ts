/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-06 13:28:00
 * @LastEditTime: 2023-10-09 16:59:21
 * @LastEditors: Derek Xu
 */
import dayjs, { Dayjs } from 'dayjs'
import solarLunar from 'solarlunar-es'
/**
 *
 * @param date 获取阴历日期
 * @returns
 */
export const lunarDay = (date: Date | string): any => {
  const dayjsDay: Dayjs = dayjs(date)
  return solarLunar.solar2lunar(dayjsDay.get('year'), dayjsDay.get('month'), dayjsDay.get('date'))
}
