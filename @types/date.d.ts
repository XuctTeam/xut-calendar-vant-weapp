/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-01 10:00:32
 * @LastEditTime: 2021-11-01 10:58:10
 * @LastEditors: Derek Xu
 */
export interface IChineseEra {
  heavenlyStems: number
  earthlyBranches: number
  era: string
  chineseZodiacAnimal: string
}

export interface ILunarData {
  month: number
  monthStr: string
  day: number
  dayStr: string
  currentMonthDaysNum: number
  isLeapMonth: boolean
  isLeapYear: boolean
  chineseEra: IChineseEra
}

export interface IListData {
  label: string
  value: any
}

export type Day = {
  year: number
  month: number
  day: number
}

/** 当前日期格式 */
export interface ICurrentDay {
  current: string
  detail: Day
  lunar: ILunarData
}
