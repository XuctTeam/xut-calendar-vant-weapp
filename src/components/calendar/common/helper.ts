import dayjs, { Dayjs } from 'dayjs'
import _flow from 'lodash/flow'
import { Solar, Lunar, HolidayUtil } from 'lunar-typescript'
import { Calendar } from '../calendar'
import * as constant from './constant'
import plugins from './plugins'

const TOTAL = 7 * 6

function getFullItem(item: Partial<Calendar.Item>, options: Calendar.GroupOptions, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean): any {
  if (!isShowStatus) return item

  const bidedPlugins = plugins.map((fn) =>
    fn.bind(null, {
      options,
      selectedDate
    })
  )
  return _flow(bidedPlugins)(item)
}

const generateCalendarGroup = (
  options: Calendar.GroupOptions
): ((generateDate: number, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean) => Calendar.ListInfo<Calendar.Item>) => {
  return function (generateDate: number, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean): Calendar.ListInfo<Calendar.Item> {
    const date = dayjs(generateDate)

    const { format, monday } = options

    // 获取生成日期的第一天 和 最后一天
    const firstDate = date.startOf('month')
    const lastDate = date.endOf('month')

    const preMonthDate = date.subtract(1, 'month')

    const list: Calendar.List<Calendar.Item> = []

    const nowMonthDays: number = date.daysInMonth() // 获取这个月有多少天
    const preMonthLastDay = preMonthDate.endOf('month').day() - (monday ? 1 : 0) // 获取上个月最后一天是周几

    // 生成上个月的日期
    for (let i = 1; i <= preMonthLastDay + 1; i++) {
      const thisDate = firstDate.subtract(i, 'day').startOf('day')
      let item = dateToCell(thisDate, format, constant.TYPE_PRE_MONTH)
      item = getFullItem(item, options, selectedDate, isShowStatus)

      list.push(item)
    }
    list.reverse()

    // 生成这个月的日期
    for (let i = 0; i < nowMonthDays; i++) {
      const thisDate = firstDate.add(i, 'day').startOf('day')
      let item = dateToCell(thisDate, format, constant.TYPE_NOW_MONTH)
      item = getFullItem(item, options, selectedDate, isShowStatus)

      list.push(item)
    }

    // 生成下个月的日期
    let i = 1
    while (list.length < TOTAL) {
      const thisDate = lastDate.add(i++, 'day').startOf('day')
      let item = dateToCell(thisDate, format, constant.TYPE_NEXT_MONTH)
      item = getFullItem(item, options, selectedDate, isShowStatus)
      list.push(item)
    }

    return {
      list,
      value: generateDate
    }
  }
}

const generateCalendarWeekGroup = (
  options: Calendar.GroupOptions
): ((generateDate: number, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean) => Calendar.ListInfo<Calendar.Item>) => {
  return function (generateDate: number, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean): Calendar.ListInfo<Calendar.Item> {
    const { format, monday } = options

    const list: Calendar.List<Calendar.Item> = []
    const date = dayjs(generateDate)
    const startWeekDay = monday ? 1 : 0
    const currentDate = date.toDate() // 获取当前日期
    const currentMonth = date.month()
    currentDate.setDate(currentDate.getDate() - ((currentDate.getDay() - startWeekDay + 7) % 7))
    const weekEndDay = calcWeekDay(startWeekDay, 6)
    while (currentDate.getDay() !== weekEndDay) {
      const month = currentDate.getMonth()
      let item = dateToCell(dayjs(currentDate), format, month - currentMonth)
      item = getFullItem(item, options, selectedDate, isShowStatus)
      list.push(item)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    const month = currentDate.getMonth()
    let item = dateToCell(dayjs(currentDate), format, month - currentMonth)
    item = getFullItem(item, options, selectedDate, isShowStatus)
    list.push(item)
    return {
      list,
      value: generateDate
    }
  }
}
export function getGenerateDate(date: Calendar.DateArg | undefined): Dayjs {
  return dayjs(date).startOf('month')
}

const dateToCell = (thisDate: Dayjs, format: string, type: number) => {
  const date = new Date(thisDate.format(format))
  return {
    marks: [],
    _value: thisDate,
    text: thisDate.date(),
    type: type,
    value: thisDate.format(format),
    extra: {
      lunarHoliday: Lunar.fromDate(date).getFestivals()[0],
      solarHoliday: Solar.fromDate(date).getFestivals()[0],
      holidays: HolidayUtil.getHoliday(thisDate.format(format)),
      lunar: Lunar.fromDate(date).getDayInChinese(),
      lunarTerms: Lunar.fromDate(date).getJieQi(),
      week: date.getDay()
    }
  }
}

/**
 * 计算current增加add天后是周几
 * @param current 当前是第几天
 * @param add 要加多少天
 */
const calcWeekDay = (current: number, add: number) => {
  return (current + add) % 7
}

export { generateCalendarGroup, generateCalendarWeekGroup }
