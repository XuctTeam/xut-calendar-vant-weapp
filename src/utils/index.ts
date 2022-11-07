import { getSystemInfo, getMenuButtonBoundingClientRect } from '@tarojs/taro'
import { SetterOrUpdater } from 'recoil'
import { cacheGet, cacheGetSync, cacheSet } from '@/cache'
import { IMenuButton } from '@/store'
import dayjs from 'dayjs'
import { ICurrentDay } from 'types/date'
import { lunarDay } from './date'
import * as CryptoJS from 'crypto-js'

function _setMenuButton(sysInfo: any, setStore: SetterOrUpdater<IMenuButton>) {
  try {
    let menuButton: any
    if (process.env.TARO_ENV === 'h5') {
      menuButton = {
        bottom: 36,
        height: 32,
        left: document.body.clientWidth - 7 - 87,
        right: document.body.clientWidth - 7,
        top: 4,
        width: 87
      }
    } else {
      menuButton = getMenuButtonBoundingClientRect()
    }
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
          statusBarHeight: sysInfo.statusBarHeight ?? menuButton.top - 4
        })
        cacheSet({
          key: 'menuButton',
          data: {
            ...menuButton,
            marginRight: sysInfo.screenWidth - menuButton.right
          }
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
        cacheSet({
          key: 'menuButton',
          data: menuButton
        })
      }
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
        statusBarHeight: sysInfo?.statusBarHeight ?? 48 - 4
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
      statusBarHeight: sysInfo?.statusBarHeight ?? 48 - 4
    })
  }
}

function _setSysInfo(menuButton: any, setStore: SetterOrUpdater<IMenuButton>, setMenuButton?: any) {
  getSystemInfo({
    success(sysInfo) {
      if (process.env.TARO_ENV === 'h5') {
        sysInfo.statusBarHeight = 0
      }
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
          statusBarHeight: sysInfo.statusBarHeight ?? menuButton.top - 4
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
          statusBarHeight: process.env.TARO_ENV === 'h5' ? 0 : menuButton.top - 4
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
          marginRight: mb.marginRight ?? si.screenWidth - mb.right,
          top: mb.top,
          statusBarHeight: si.statusBarHeight ?? mb.top - 4
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

export function setWxBrower(is: boolean) {
  cacheSet({
    key: 'wxBrower',
    data: is
  })
}

/**
 *加密处理
 */
export const encryption = (params) => {
  let { data, type, param, key } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach((ele) => {
      result[ele] = base64(result[ele])
    })
  } else {
    param.forEach((ele) => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
      })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

export const useNav = () => !(process.env.TARO_ENV === 'h5' && cacheGetSync('wxBrower'))

/**
 * 获取当日日期
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
  // 对字符串进行编码
  var encode = encodeURI(str)
  // 对编码的字符串转化base64
  var base64 = base64_encode(encode)
  return base64
}

/**
 * 获取星期格式化
 * @param week
 * @returns
 */
export const formatWeek = (week: number): string => {
  switch (week) {
    case 0:
      return '周日'
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
  }
  return ''
}

/**
 * 格式化重复事件
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
      return repeatInterval === 1 ? '每天' : '每' + repeatInterval + '天'
    case 'WEEKLY':
      return _formatWeeklyText(repeatInterval, repeatStatus, repeatByday)
    case 'MONTHLY':
      return _formatMonthlyText(repeatInterval, repeatStatus, repeatByday, repeatBymonthday)
    default:
      return _formatYearlyText(repeatInterval, repeatBymonth, repeatBymonthday)
  }
}

/**
 * 提醒类型通过类型换code
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
 * 格式化提醒显示
 * @param alarm
 * @returns
 */
export const formatAlarmText = (alarmType: string, alarmTimes: Array<string>): string => {
  if (alarmType === '0') return '不提醒'
  if (alarmTimes.length === 0) return '不提醒'
  const formatTimes: Array<string> = alarmTimes.map((i) => {
    if (i === '60') return '1小时前'
    else if (i === '1440') return '1天前'
    return i + '分钟前'
  })
  let alarmTypeStr = ''
  switch (alarmType) {
    case '1':
      alarmTypeStr = '站内信提醒'
      break
    case '2':
      alarmTypeStr = '邮箱提醒'
      break
    default:
      alarmTypeStr = '公众号提醒'
  }
  formatTimes.push(alarmTypeStr)
  return formatTimes.join('，')
}

/**
 * 格式化相同时间区间
 * @param fullDay
 * @param dtstart
 * @param dtend
 * @returns
 */
export const formatSameDayTime = (fullDay: number, dtstart: Date, dtend: Date): string => {
  const day: string = dayjs(dtstart).format('YYYY年MM月DD日') + '(' + formatWeek(dayjs(dtend).get('day')) + ')'
  if (fullDay === 1) return day
  return day + dayjs(dtstart).format('HH:mm') + '-' + dayjs(dtend).format('HH:mm')
}

/**
 * 格式化相同时间区间的分、秒
 * @returns
 */
export const formateSameDayDuration = (fullDay: number, dtstart: Date, dtend: Date): string => {
  if (fullDay === 1) return '全天'
  let days = dayjs(dtend)
  let daye = dayjs(dtstart)
  const day1 = days.format('YYYY-MM-DD') + ' ' + days.hour() + ':' + days.minute() + ':00'
  const day2 = daye.format('YYYY-MM-DD') + ' ' + daye.hour() + ':' + daye.minute() + ':00'
  days = dayjs(day1)
  daye = dayjs(day2)
  const diff: number = days.diff(daye, 'minute')
  if (diff < 60 && diff > 0) return diff + '分钟'
  if (diff === 60) return '1小时'
  const hour = parseInt(diff / 60 + '')
  return hour + '小时' + (diff - hour * 60 > 0 ? diff - hour * 60 + '分钟' : '')
}

/**
 * 格式化不同时间区间
 * @param type
 * @param fullDay
 * @param date
 * @returns
 */
export const formatDifferentDayTime = (type: number, fullDay: number, date: Date): string => {
  if (type === 1) {
    return dayjs(date).format(fullDay === 0 ? 'YYYY年MM月DD日 HH:mm' : 'YYYY年MM月DD日') + ' 开始'
  }
  return dayjs(date).format(fullDay === 0 ? 'YYYY年MM月DD日 HH:mm' : 'YYYY年MM月DD日') + ' 结束'
}

/**
 * 格式化星期显示
 * @param repeatInterval
 * @param repeatStatus
 * @param repeatByday
 * @returns
 */
const _formatWeeklyText = (repeatInterval: number, repeatStatus: string, repeatByday: string): string => {
  switch (repeatStatus) {
    case '2':
      return '每周一至五'
    case '3':
      return '每周六、周日'
    case '4':
      return '每周（周六）'
    default:
      break
  }
  const weeks = repeatByday.split(',').map((i: string) => {
    const week: string | undefined = i.split(':')[1]
    if (!week) return
    return formatWeek(Number.parseInt(week))
  })
  return (repeatInterval === 1 ? '每周' : '每' + repeatInterval + '周的') + weeks.join(',')
}

/**
 * 格式化月显示
 * @param repeatInterval
 * @param repeatStatus
 * @param repeatBymonth
 * @param repeatBymonthday
 * @param selectedDate
 */
const _formatMonthlyText = (repeatInterval: number, repeatStatus: string, repeatByday: string, repeatBymonthday: string): string => {
  if (repeatStatus === '5') {
    return '每月（' + repeatBymonthday + '日）'
  }
  if (repeatStatus === '6') {
    const monthDays = repeatByday ? repeatByday.split(':') : []
    if (!monthDays[1]) return ''
    return '每月（第' + monthDays[0] + '个' + formatWeek(Number.parseInt(monthDays[1])) + ')'
  }
  if (repeatBymonthday) {
    if (repeatInterval === 1) {
      return '每月（' + repeatBymonthday + '日）'
    }
    return '每' + repeatInterval + '月（' + repeatBymonthday + '日）'
  }
  const monthDays = repeatByday ? repeatByday.split(':') : []
  if (!monthDays[1]) return ''
  if (repeatInterval === 1) {
    return '每月（第' + monthDays[0] + '个' + monthDays[1] + ')'
  }
  return '每' + repeatInterval + '月（第' + monthDays[0] + '个' + formatWeek(Number.parseInt(monthDays[1])) + ')'
}

/**
 * 格式化年重复
 * @param repeatInterval
 * @param repeatBymonth
 * @param repeatBymonthday
 */
const _formatYearlyText = (repeatInterval: number, repeatBymonth: string, repeatBymonthday: string) => {
  if (repeatInterval === 1) {
    return '每年（' + repeatBymonth + '月' + repeatBymonthday + '日）'
  }
  return '每' + repeatInterval + '年（' + repeatBymonth + '月' + repeatBymonthday + '日）'
}

/**
 * 格式化五分钟
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
 * 正则判断电话号码
 * @param phone
 * @returns
 */
export const checkMobile = (phone: string): boolean => {
  return /^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)
}

/**
 * 正则验证邮箱
 * @param email
 * @returns
 */
export const checkEmail = (email: string): boolean => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(email)
}

/**
 * 正则校验密码
 *
 * @param password
 * @returns
 */
export const checkPassowrd = (password: string): boolean => {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(password)
}

const base64_encode = (str) => {
  var c1, c2, c3
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var i = 0,
    len = str.length,
    string = ''

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2)
      string += base64EncodeChars.charAt((c1 & 0x3) << 4)
      string += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      string += base64EncodeChars.charAt(c1 >> 2)
      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      string += base64EncodeChars.charAt((c2 & 0xf) << 2)
      string += '='
      break
    }
    c3 = str.charCodeAt(i++)
    string += base64EncodeChars.charAt(c1 >> 2)
    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    string += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    string += base64EncodeChars.charAt(c3 & 0x3f)
  }
  return string
}
