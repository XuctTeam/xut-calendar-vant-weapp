/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-05 16:50:55
 * @LastEditTime: 2022-04-19 11:10:56
 * @LastEditors: Derek Xu
 */

export interface IDavCalendar {
  id: string
  name: string
  color: string
  major: number
  display: number
  checked?: boolean
  memberId: string
  calendarId: string
  createMemberId: string
  createMemberName: string
  description: string
  isShare: number
  alarmTime: number
  alarmType: string
}

export interface IDavComponent {
  id: string
  calendarId: string
  creatorMemberId: string
  status: string
  summary: string
  location: string
  description: string
  dtstart: Date
  dtend: Date
  startTime?: string
  endTime?: string
  alarmType: string
  alarmTimes?: string
  fullDay: number
  color?: string
  calendarName?: string
  repeatStatus?: string
  repeatType?: string
  repeatByday?: string
  repeatBymonth?: string
  repeatBymonthday?: string
  repeatInterval?: number
  repeatUntil?: string
  memberIds?: string[]
  attendStatus: number
}

export interface ICalendarComponent {
  day: string
  calendarId: string
  components: Array<IDavComponent>
}

/**
 * 日程分页查询对象
 */
export interface ICalendarPageComponent {
  finished: boolean
  components: Array<IDavComponent>
}

export interface IDvaCalendarProps {
  calendar: {
    calendars: IDavCalendar[]
  }
}

export interface IDvaComponentProps {
  component: {
    refreshTime: number
  }
}
