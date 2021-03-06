import { getSystemInfo, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { SetterOrUpdater } from 'recoil'
import { cacheGet, cacheSet, cacheGetSync } from '@/cache'
import { IMenuButton } from '@/store'
import dayjs from 'dayjs'
import { ICurrentDay } from '../../@types/date'
import { lunarDay } from './date'

function _setMenuButton(sysInfo: any, setStore: SetterOrUpdater<IMenuButton>) {
  try {
    const menuButton = getMenuButtonBoundingClientRect()
    if (menuButton) {
      if (sysInfo) {
        setStore({
          precise: true,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: sysInfo.screenWidth - menuButton.right,
          top: menuButton.top,
          statusBarHeight: sysInfo.statusBarHeight || menuButton.top - 4
        })
      } else {
        setStore({
          precise: false,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: 7,
          top: menuButton.top,
          statusBarHeight: menuButton.top - 4
        })
      }
      cacheSet({
        key: 'menuButton',
        data: menuButton
      })
    } else {
      setStore({
        precise: false,
        bottom: 80,
        height: 32,
        width: 87,
        left: 281,
        right: 368,
        marginRight: 7,
        top: 48,
        statusBarHeight: sysInfo?.statusBarHeight || 48 - 4
      })
    }
  } catch (error) {
    setStore({
      precise: false,
      bottom: 80,
      height: 32,
      width: 87,
      left: 281,
      right: 368,
      marginRight: 7,
      top: 48,
      statusBarHeight: sysInfo?.statusBarHeight || 48 - 4
    })
  }
}

function _setSysInfo(menuButton: any, setStore: SetterOrUpdater<IMenuButton>, setMenuButton?: any) {
  getSystemInfo({
    success(sysInfo) {
      if (menuButton) {
        setStore({
          precise: true,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: sysInfo.screenWidth - menuButton.right,
          top: menuButton.top,
          statusBarHeight: sysInfo.statusBarHeight || menuButton.top - 4
        })
      } else {
        setMenuButton(sysInfo, setStore)
      }
      cacheSet({
        key: 'sysInfo',
        data: sysInfo
      })
    },
    fail() {
      if (menuButton) {
        setStore({
          precise: false,
          bottom: menuButton.bottom,
          height: menuButton.height,
          width: menuButton.width,
          left: menuButton.left,
          right: menuButton.right,
          marginRight: 7,
          top: menuButton.top,
          statusBarHeight: menuButton.top - 4
        })
      } else {
        setMenuButton(null, setStore)
      }
    }
  })
}

export function setMenuButtonAsync(setStore: SetterOrUpdater<IMenuButton>) {
  cacheGet({ key: 'menuButton' }).then((mb) => {
    cacheGet({ key: 'sysInfo' }).then((si) => {
      if (mb && si) {
        setStore({
          precise: true,
          bottom: mb.bottom,
          height: mb.height,
          width: mb.width,
          left: mb.left,
          right: mb.right,
          marginRight: si.screenWidth - mb.right,
          top: mb.top,
          statusBarHeight: si.statusBarHeight || mb.top - 4
        })
      } else if (mb) {
        _setSysInfo(mb, setStore)
      } else if (si) {
        _setMenuButton(si, setStore)
      } else {
        _setSysInfo(null, setStore, _setMenuButton)
      }
    })
  })
}

export function setSysInfoAsync(force = false) {
  if (force) {
    getSystemInfo({
      success(sysInfo) {
        cacheSet({
          key: 'sysInfo',
          data: sysInfo
        })
      }
    })
  } else {
    cacheGet({ key: 'sysInfo' }).then((si) => {
      if (!si) {
        getSystemInfo({
          success(sysInfo) {
            cacheSet({
              key: 'sysInfo',
              data: sysInfo
            })
          }
        })
      }
    })
  }
}

export function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function setWxBrower(is: boolean) {
  cacheSet({
    key: 'wxBrower',
    data: is
  })
}

export function bound(position: number, min: number | undefined, max: number | undefined) {
  let ret = position
  if (min !== undefined) {
    ret = Math.max(position, min)
  }
  if (max !== undefined) {
    ret = Math.min(ret, max)
  }
  return ret
}

export function rubberband(distance: number, dimension: number, constant: number) {
  return (distance * dimension * constant) / (dimension + constant * distance)
}

export function rubberbandIfOutOfBounds(position: number, min: number, max: number, dimension: number, constant = 0.15) {
  if (constant === 0) return bound(position, min, max)
  if (position < min) return -rubberband(min - position, dimension, constant) + min
  if (position > max) return +rubberband(position - max, dimension, constant) + max
  return position
}

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export const brower = () => {
  return process.env.TARO_ENV === 'h5' && !cacheGetSync('wxBrower')
}

/**
 * ??????????????????
 *
 * @returns
 */
export const getToday = (): ICurrentDay => {
  let day = dayjs()
  return {
    current: day.format('YYYY-MM-DD'),
    detail: {
      year: day.year(),
      month: day.month() + 1,
      day: day.day()
    },
    lunar: lunarDay(day.toDate())
  }
}

/**
 * base 64
 * @param str
 * @returns
 */
export const base64 = (str: string): string => {
  const buff = Buffer.from(str, 'utf-8')
  return buff.toString('base64')
}

/**
 * ?????????????????????
 * @param week
 * @returns
 */
export const formatWeek = (week: number): string => {
  switch (week) {
    case 0:
      return '??????'
    case 1:
      return '??????'
    case 2:
      return '??????'
    case 3:
      return '??????'
    case 4:
      return '??????'
    case 5:
      return '??????'
    case 6:
      return '??????'
  }
  return ''
}

/**
 * ?????????????????????
 * @param repeatType
 * @param repeatByday
 * @param repeatBymonth
 * @param repeatBymonthday
 */
export const formatRepeatTime = (
  repeatType: string,
  repeatStatus: string,
  repeatByday: string,
  repeatBymonth: string,
  repeatBymonthday: string,
  repeatInterval: number
): string => {
  switch (repeatType) {
    case 'DAILY':
      return repeatInterval === 1 ? '??????' : '???' + repeatInterval + '???'
    case 'WEEKLY':
      return _formatWeeklyText(repeatInterval, repeatStatus, repeatByday)
    case 'MONTHLY':
      return _formatMonthlyText(repeatInterval, repeatStatus, repeatByday, repeatBymonthday)
    default:
      return _formatYearlyText(repeatInterval, repeatBymonth, repeatBymonthday)
  }
}

/**
 * ???????????????????????????code
 * @param alarmType
 * @returns
 */
export const alarmTypeToCode = (alarmType: string): string => {
  let _alarmType: string = '0'
  switch (alarmType) {
    case 'INTERNAL_MESSAGE':
      _alarmType = '1'
      break
    case 'MAIL':
      _alarmType = '2'
      break
    case 'OFFICIAL_ACCOUNT':
      _alarmType = '3'
      break
  }
  return _alarmType
}

export const alarmCodeToType = (code: string) => {
  switch (code) {
    case '1':
      return 'INTERNAL_MESSAGE'
    case '2':
      return 'MAIL'
    case '3':
      return 'OFFICIAL_ACCOUNT'
    default:
      return 'UNKNOWN'
  }
}

/**
 * ?????????????????????
 * @param alarm
 * @returns
 */
export const formatAlarmText = (alarmType: string, alarmTimes: Array<string>): string => {
  if (alarmType === '0') return '?????????'
  if (alarmTimes.length === 0) return '?????????'
  const formatTimes: Array<string> = alarmTimes.map((i) => {
    if (i === '60') return '1?????????'
    else if (i === '1440') return '1??????'
    return i + '?????????'
  })
  let alarmTypeStr = ''
  switch (alarmType) {
    case '1':
      alarmTypeStr = '???????????????'
      break
    case '2':
      alarmTypeStr = '????????????'
      break
    default:
      alarmTypeStr = '???????????????'
  }
  formatTimes.push(alarmTypeStr)
  return formatTimes.join('???')
}

/**
 * ???????????????????????????
 * @param fullDay
 * @param dtstart
 * @param dtend
 * @returns
 */
export const formatSameDayTime = (fullDay: number, dtstart: Date, dtend: Date): string => {
  const day: string = dayjs(dtstart).format('YYYY???MM???DD???') + '(' + formatWeek(dayjs(dtend).get('day')) + ')'
  if (fullDay === 1) return day
  return day + dayjs(dtstart).format('HH:mm') + '-' + dayjs(dtend).format('HH:mm')
}

/**
 * ???????????????????????????????????????
 * @returns
 */
export const formateSameDayDuration = (fullDay: number, dtstart: Date, dtend: Date): string => {
  if (fullDay === 1) return '??????'
  let days = dayjs(dtend)
  let daye = dayjs(dtstart)
  const day1 = days.format('YYYY-MM-DD') + ' ' + days.hour() + ':' + days.minute() + ':00'
  const day2 = daye.format('YYYY-MM-DD') + ' ' + daye.hour() + ':' + daye.minute() + ':00'
  days = dayjs(day1)
  daye = dayjs(day2)
  const diff: number = days.diff(daye, 'minute')
  if (diff < 60) return diff + '??????'
  if (diff === 60) return '1??????'
  const hour = parseInt(diff / 60 + '')
  return hour + '??????' + (diff - hour * 60) + '??????'
}

/**
 * ???????????????????????????
 * @param type
 * @param fullDay
 * @param date
 * @returns
 */
export const formatDifferentDayTime = (type: number, fullDay: number, date: Date): string => {
  if (type === 1) {
    return dayjs(date).format(fullDay === 0 ? 'YYYY???MM???DD??? HH:mm' : 'YYYY???MM???DD???') + ' ??????'
  }
  return dayjs(date).format(fullDay === 0 ? 'YYYY???MM???DD??? HH:mm' : 'YYYY???MM???DD???') + ' ??????'
}

/**
 * ?????????????????????
 * @param repeatInterval
 * @param repeatStatus
 * @param repeatByday
 * @returns
 */
const _formatWeeklyText = (repeatInterval: number, repeatStatus: string, repeatByday: string): string => {
  switch (repeatStatus) {
    case '2':
      return '???????????????'
    case '3':
      return '??????????????????'
    case '4':
      return '??????????????????'
    default:
      break
  }
  const weeks = repeatByday.split(',').map((i: string) => {
    const week: string | undefined = i.split(':')[1]
    if (!week) return
    return formatWeek(Number.parseInt(week))
  })
  return (repeatInterval === 1 ? '??????' : '???' + repeatInterval + '??????') + weeks.join(',')
}

/**
 * ??????????????????
 * @param repeatInterval
 * @param repeatStatus
 * @param repeatBymonth
 * @param repeatBymonthday
 * @param selectedDate
 */
const _formatMonthlyText = (repeatInterval: number, repeatStatus: string, repeatByday: string, repeatBymonthday: string): string => {
  const monthDays = repeatByday ? repeatByday.split(':') : []
  if (!monthDays[1]) return ''
  switch (repeatStatus) {
    case '5':
      return '?????????' + repeatBymonthday + '??????'
    case '6':
      return '????????????' + monthDays[0] + '???' + formatWeek(Number.parseInt(monthDays[1])) + ')'
  }
  if (repeatBymonthday) {
    if (repeatInterval === 1) {
      return '?????????' + repeatBymonthday + '??????'
    }
    return '???' + repeatInterval + '??????' + repeatBymonthday + '??????'
  }

  if (repeatInterval === 1) {
    return '????????????' + monthDays[0] + '???' + monthDays[1] + ')'
  }
  return '???' + repeatInterval + '?????????' + monthDays[0] + '???' + formatWeek(Number.parseInt(monthDays[1])) + ')'
}

/**
 * ??????????????????
 * @param repeatInterval
 * @param repeatBymonth
 * @param repeatBymonthday
 */
const _formatYearlyText = (repeatInterval: number, repeatBymonth: string, repeatBymonthday: string) => {
  if (repeatInterval === 1) {
    return '?????????' + repeatBymonth + '???' + repeatBymonthday + '??????'
  }
  return '???' + repeatInterval + '??????' + repeatBymonth + '???' + repeatBymonthday + '??????'
}

/**
 * ??????????????????
 * @param date
 */
export const fiveMinutes = (date: Date): Date => {
  const min = dayjs(date).minute()
  if (min % 5 === 0) return date
  if (min > 55) return dayjs(date).add(1, 'hour').minute(0).second(0).toDate()
  const d = dayjs(date)
    .add(5 - (min % 5), 'minute')
    .second(0)
    .toDate()
  return d
}

/**
 * ????????????????????????
 * @param phone
 * @returns
 */
export const checkMobile = (phone: string): boolean => {
  return /^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)
}

/**
 * ??????????????????
 * @param email
 * @returns
 */
export const checkEmail = (email: string): boolean => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(email)
}

/**
 * ??????????????????
 *
 * @param password
 * @returns
 */
export const checkPassowrd = (password: string): boolean => {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(password)
}
