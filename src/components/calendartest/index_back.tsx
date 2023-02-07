import { Swiper, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import { FC, useEffect, useMemo, useState } from 'react'
import solarLunar from 'solarlunar-es'
import SwiperItemNode from './ui/SwiperItemNode'
import './index.less'

interface IPageState {
  currentDay: Date
  firstDayOfWeek?: string //每周的周几为第一天
  signList?: any[] //标记
  weekend?: boolean //周末标红
  shrinkState?: string // 默认打开状态（收起或展开）
  showLunar?: Boolean //是否显示农历
}

const Calendartest: FC<IPageState> = ({ currentDay, showLunar = false, firstDayOfWeek = 'monday', signList = [], weekend = true, shrinkState = 'month' }) => {
  // 收缩状态，true:收起(显示周)，false展开(显示月)
  const [shrinkType, setShrinkType] = useState<boolean>(false)
  //轮播时间(单位毫秒)
  const [tranDuration, setTranDuration] = useState<number>(0)
  // 周轮播所在位置
  const [tranCurrent, setTranCurrent] = useState<number>(1)
  // 月份轮播所在位置
  const [tranIndex, setTranIndex] = useState<number>(1)
  // 月份数据 -> [[[周],[周]],[月],[月]]
  const [allMonthList, setAllMonthList] = useState<any[]>([])

  const [allWeekList, setAllWeekList] = useState<any[]>([])

  //显示回到今天(非当月才显示)
  const [showToday, setShowToday] = useState<boolean>(false)

  //星期数组
  const [weekArr, setWeekArr] = useState<string[]>(['一', '二', '三', '四', '五', '六', '日'])

  //今天日期 -> year, month, day
  const [today, setToday] = useState<CALENDAR.DAY>({ year: 0, month: 0, day: 0 })
  //选中日期信息 -> year, month, day
  const [selDate, setSelDate] = useState<CALENDAR.DAY>({ year: 0, month: 0, day: 0 })

  const [signArr, setSignArr] = useState<any[]>(signList)

  const [inited, setInited] = useState<boolean>(false)

  useEffect(() => {
    const _day = {
      year: currentDay.getFullYear(),
      month: currentDay.getMonth() + 1,
      day: currentDay.getDate()
    }
    setToday(_day)
    if (firstDayOfWeek == 'sunday') {
      setWeekArr(['日', '一', '二', '三', '四', '五', '六'])
    }
    initDate(_day)
  }, [currentDay])

  // 初始化日期

  const initDate = (now: any) => {
    const selDate = JSON.parse(JSON.stringify(now))
    setSelDate(selDate)
    let monthList = getMonthData(selDate) // 获取当月数据
    let prevMonthList = getMonthData(getMonthDate(selDate, -1)) // 上月数据
    let nextMonthList = getMonthData(getMonthDate(selDate)) // 下月数据
    setAllMonthList([prevMonthList, monthList, nextMonthList])
    setTranIndex(1)
    setInited(true)
    if (shrinkState == 'week' && !shrinkType) {
      changeShrink()
    }
  }

  /**
   * 根据指定日期获取当月的数据
   * @param {Object} date = { year, month, day } 指定的日期
   */
  const getMonthData = (date) => {
    const { year, month, day } = date //指定的日期
    let maxDay = new Date(year, month, 0).getDate() //当前月最大日期
    let firstWeek = new Date(year + '/' + month + '/1').getDay() //月份1号的星期数
    if (firstDayOfWeek == 'monday') {
      firstWeek = firstWeek - 1 < 0 ? 6 : firstWeek - 1
    }
    let list = []
    //每月显示42天，6周，每周7天
    for (var i = 0; i < 42; i++) {
      let dayInfo = {} // 每天的详细信息
      if (i < firstWeek) {
        //指定月份上月的最后几天
        let { year, month } = getMonthDate(date, -1)
        let preMaxDay = new Date(year, month, 0).getDate() //上月最大日期
        let day = preMaxDay - firstWeek + i + 1
        dayInfo = getDayInfo({ year, month, day }, 'prev')
      } else if (i > maxDay + firstWeek - 1) {
        //指定月份下月的前几天
        let { year, month } = getMonthDate(date)
        let day = i - maxDay - firstWeek + 1
        dayInfo = getDayInfo({ year, month, day }, 'next')
      } else {
        let day = i - firstWeek + 1
        dayInfo = getDayInfo({ year, month, day }, 'normal')
      }
      if (i % 7 == 0) {
        //@ts-ignore
        list.push([])
      }
      //@ts-ignore
      list[list.length - 1].push(dayInfo)
    }
    return list
  }

  /**
   * 获取指定日期的详细信息，包括农历节假日等
   * @param {Object} date = { year, month, day } 指定的日期
   * @param {String} dayType = [prev|next|normal] 日期类型，上月|下月|当前月
   */
  const getDayInfo = (date, dayType) => {
    const { year, month, day } = date
    let isToday = false //是否今天
    if (year == today.year && month == today.month && day == today.day) isToday = true
    let week = new Date(year + '/' + month + '/' + day).getDay() //星期数
    let lunar = solarLunar.solar2lunar(year, month, day) //农历
    //let dayLunar = lunar == '初一' ? lunar.IMonthCn + lunar.IDayCn : lunar.IDayCn
    let dayLunar
    //if (lunar.festival) dayLunar = lunar.festival // 阳历节日
    //else if (lunar.lunarFestival) dayLunar = lunar.lunarFestival // 农历节日
    //else if (lunar.) dayLunar = lunar.Term // 节气
    let holidayArr = ['元旦', '春节', '清明节', '劳动节', '端午节', '中秋节', '国庆节']
    let isHoliday = false
    if (holidayArr.indexOf(dayLunar) != -1) isHoliday = true
    let dayInfo = {
      date: year + '-' + month + '-' + day,
      year,
      month,
      day,
      week,
      lunar, // 农历
      dayLunar, // 显示的农历
      isToday, // 是否是今日
      isHoliday, // 是否是节假日
      dayType, // 日期类型，上月、下月或当前月
      sign: getSignByDate(date)
    }
    let dayClass = getDayClass(dayInfo)
    dayInfo['dayClass'] = dayClass
    return dayInfo
  }

  // 点击收缩按钮，切换显示月份或显示周
  const changeShrink = () => {
    const _shrinkType = !shrinkType
    setShrinkType(_shrinkType)

    if (tranDuration != 0) {
      setTranDuration(0)
    }
    if (_shrinkType) {
      setTranCurrent(1)
      getAllWeekData()
    }
    returnShrinkChange()
    judgeShowToday()
  }

  // 根据月份数据获取周数据，相当初始化周数据

  const getAllWeekData = () => {
    const { prevNum, nowNum, nextNum } = getTranIndex('month')
    const { year: selYear, month: selMonth, day: selDay } = selDate
    let sDate = selYear + '-' + selMonth + '-' + selDay // 选中的日期
    let allWeekList = [[], [], []]
    let prevMonthList = allMonthList[prevNum]
    let nowMonthList = allMonthList[nowNum]
    let nextMonthList = allMonthList[nextNum]
    for (let i = 0; i < nowMonthList.length; i++) {
      for (let j = 0; j < nowMonthList[i].length; j++) {
        if (sDate == nowMonthList[i][j].date) {
          //@ts-ignore
          allWeekList[0][0] = nowMonthList[i - 1]
          //@ts-ignore
          allWeekList[1][0] = nowMonthList[i]
          //@ts-ignore
          allWeekList[2][0] = nowMonthList[i + 1]
          if (i == 5) {
            //@ts-ignore
            allWeekList[2][0] = nextMonthList[1]
          } else if (i == 0) {
            for (let k = prevMonthList.length - 1; k >= 0; k--) {
              if (prevMonthList[k][6].dayType == 'normal') {
                //@ts-ignore
                allWeekList[0][0] = prevMonthList[k]
                break
              }
            }
          }
          break
        }
      }
    }
    setAllWeekList(allWeekList)
  }

  /**
   * 获取月份数据
   * @param {String} type=[pre|next]
   */
  const getOtherData = (type: string) => {
    let nowMont = getMonthDate(selDate, type == 'prev' ? -1 : 1) // 获取当前月份
    setSelDate(nowMont) // 切换月份后设置选中的日期
    let monthData = getMonthData(getMonthDate(nowMont, type == 'prev' ? -1 : 1))
    // 获取上月或下月轮播所在位置
    let current = getTranIndex().prevNum
    if (type == 'next') current = getTranIndex().nextNum
    const _allMonthList = [...allMonthList]
    _allMonthList.splice(current, 1, monthData)
    setAllMonthList(_allMonthList)
    judgeShowToday()
    useRefT.current = true
    returnMonthChange(type)
  }

  // 从月历中获取周数据，切换周后获取上周或下周数据
  const getWeekData = (type) => {
    const { prevNum: prevIndex, nowNum: nowIndex, nextNum: nextIndex } = getTranIndex('month')
    const { prevNum: prevCurrent, nowNum: nowCurrent, nextNum: nextCurrent } = getTranIndex('week')
    const { year: selYear, month: selMonth, day: selDay } = selDate
    let sDate = selYear + '-' + selMonth + '-' + selDay
    let prevMonthList = allMonthList[prevIndex]
    let nowMonthList = allMonthList[nowIndex]
    let nextMonthList = allMonthList[nextIndex]
    for (let i = 0; i < nowMonthList.length; i++) {
      for (let j = 0; j < nowMonthList[i].length; j++) {
        if (sDate == nowMonthList[i][j].date) {
          returnDayChange(nowMonthList[i][j]) // 返回选中的日期
          if (type == 'next') {
            allWeekList.splice(nextCurrent, 1, [nowMonthList[i + 1]])
            if (i == 5) allWeekList.splice(nextCurrent, 1, [nextMonthList[1]])
          } else {
            allWeekList.splice(prevCurrent, 1, [nowMonthList[i - 1]])
            if (i == 0) {
              for (let k = prevMonthList.length - 1; k >= 0; k--) {
                if (prevMonthList[k][6].dayType == 'normal') {
                  allWeekList.splice(prevCurrent, 1, [prevMonthList[k]])
                  break
                }
              }
            }
          }
          break
        }
      }
    }
  }

  /**
   * 获取周数据
   * @param {String} type=[pre|next]
   */
  const getOtherWeekData = (type) => {
    let oldSel = selDate // 原选中的日期
    let newSel = getDateByDateAndDay(oldSel, type == 'prev' ? -7 : 7) // 获取7天前或后的日期
    if (oldSel.month != newSel.month) {
      // 跨月，先设置跨月后的月历
      // 设置月轮播位置
      let current = getTranIndex('month').prevNum
      if (type == 'next') current = getTranIndex('month').nextNum
      setTranIndex(current)
      getOtherData(type)
    }
    setSelDate(newSel)
    getWeekData(type)
    judgeShowToday()
  }

  /**
   * 根据日期获取日期对应的事件
   * @param {Object} date = { year, month, day } 指定的日期
   */
  const getSignByDate = (date) => {
    const { year, month, day } = date
    let dayDateS = new Date(year + '/' + month + '/' + day + ' 00:00:00').getTime()
    let dayDateE = new Date(year + '/' + month + '/' + day + ' 23:59:59').getTime()
    let daySign = []
    signArr.map((sign) => {
      let signDate = sign.date.replace(/-/g, '/')
      let signTimes = new Date(sign.date).getTime()
      if (signTimes >= dayDateS && signTimes <= dayDateE) {
        daySign.push(sign)
      }
    })
    return daySign
  }

  /**
   * 根据日期详细信息添加对应的class
   * @param {Object} dayInfo 日期详情
   */
  const getDayClass = (dayInfo) => {
    let dClass = ''
    if (dayInfo.isToday) dClass += ' is-today' // 今天日期
    if (dayInfo.isHoliday) dClass += ' is-holiday' // 法定假日
    if (weekend && (dayInfo.week == 0 || dayInfo.week == 6)) dClass += ' week-end' // 周末标红
    return dClass
  }

  /**
   * 获取上一个或下一个轮播位置
   * @param {String} type = [month|week] 轮播类型，月轮播(tranIndex),周轮播(tranCurrent)
   * @returns {Object} {prevNum, nowNum, nextNum}
   */
  const getTranIndex = (type = 'month') => {
    let current = tranIndex
    if (type == 'week') current = tranCurrent
    let prevNum = current - 1 < 0 ? 2 : current - 1
    let nowNum = current
    let nextNum = current + 1 > 2 ? 0 : current + 1
    return { prevNum, nowNum, nextNum }
  }

  /**
   * 根据日期获取几天后的日期
   * @param {Object} date = {year, month, day} 当前日期
   * @param {Number} day 当前日期的几天前或几天后(负数)
   * @returns {Object} {year, month, day}
   */
  const getDateByDateAndDay = (date, num) => {
    let dTime = new Date(date.year + '/' + date.month + '/' + date.day).getTime() + num * 24 * 60 * 60 * 1000
    let nd = new Date(dTime)
    return {
      year: nd.getFullYear(),
      month: nd.getMonth() + 1,
      day: nd.getDate()
    }
  }

  /**
   * 获取几个月前或后的日期
   * @param {Object} date = {year, month, day} 当前日期
   * @param {Number} num 当前日期的num月前或后，默认1月后(下月)
   * @returns {Object} {year, month, day}
   */
  const getMonthDate = (date, num = 1) => {
    let nextMonth = date.month + num
    let diffYear = parseInt(Math.abs(nextMonth) / 12 + '')

    let year = date.year
    let month = nextMonth
    if (nextMonth > 12) {
      year = date.year + diffYear
      month = nextMonth % 12
    } else if (nextMonth < 1) {
      year = date.year - (diffYear + 1)
      month = nextMonth + 12 * (diffYear + 1)
    }
    let monthMaxDay = new Date(year, month, 0).getDate() // 月份最大日期
    let day = date.day > monthMaxDay ? monthMaxDay : date.day
    return { year, month, day }
  }

  // 判断是否需要显示回到今天（非本月或本周时显示）
  const judgeShowToday = () => {
    const { year, month, day } = today
    const { year: selYeat, month: selMonth, day: selDay } = selDate
    if (shrinkType) {
      // 显示的周
      let selTimes = new Date(selYeat, selMonth - 1, selDay).getTime() // 选中日期的时间戳
      let week = new Date(year, month - 1, day).getDay() // 今天星期
      let firstWD = getDateByDateAndDay(today, -week + (firstDayOfWeek == 'monday' ? 1 : 0))
      let lastWD = getDateByDateAndDay(today, 6 - week + (firstDayOfWeek == 'monday' ? 1 : 0))
      let firstTimes = new Date(firstWD.year, firstWD.month - 1, firstWD.day).getTime()
      let lastTimes = new Date(lastWD.year, lastWD.month - 1, lastWD.day).getTime()
      if (selTimes > lastTimes || selTimes < firstTimes) {
        setShowToday(true)
        return
      }
      setShowToday(false)
    } else {
      if (year != selYeat || month != selMonth) {
        setShowToday(true)
        return
      }
      setShowToday(false)
    }
  }

  /**
   * 事件 - 设置返回日期
   * @param {Object} dayInfo 日期详情
   */
  const returnDayChange = (dayInfo) => {
    let { year, month, day } = dayInfo
    let dayDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
    let returnData = {
      date: dayDate,
      year: year,
      month: month,
      day: day,
      week: dayInfo.week,
      daySign: dayInfo.sign
    }
    if (showLunar) returnData['lunar'] = dayInfo.lunar
    //this.$emit('dayChange', returnData)
  }

  /**
   * 事件 - 返回收缩状态
   */
  const returnShrinkChange = () => {
    let type = shrinkType ? 'week' : 'month'
    //this.$emit("shrinkClick", type);
  }

  /**
   * 事件 - 设置返回月份
   * @param {String} type 类型
   */
  const returnMonthChange = (type) => {
    let _selDate = selDate.year + '-' + selDate.month + '-' + selDate.day
    let monthList = allMonthList.flat().flat() // 二维转一维
    let dayInfo = monthList.find((day) => day.date == _selDate)
    returnDayChange(dayInfo)
    // this.$emit("monthChange", {
    //   year: dayInfo.year,
    //   month: dayInfo.month,
    //   type: type
    // });
  }

  /**
   * 滑动切换月份或周
   */
  const swiperChange = (e) => {
    let current = e.detail.current
    let oldIndex = shrinkType ? tranCurrent : tranIndex
    let type = oldIndex - current == -1 || oldIndex - current == 2 ? 'next' : 'prev'
    if (shrinkType) {
      setTranCurrent(current)
      if (current != oldIndex) {
        getOtherWeekData(type)
      }
    } else {
      setTranIndex(current)
      if (current != oldIndex) {
        getOtherData(type)
      }
    }
  }

  // 滑动切换结束
  const swiperEndChange = () => {
    setTranDuration(300)
  }

  const _allData = useMemo(() => {
    return shrinkType ? allWeekList : allMonthList
  }, [shrinkType, allMonthList, allWeekList])

  return (
    <View className='lunc-calendar'>
      <View className='header'>
        <View className='head-icon head-pre-month' />
        <View className='head-month'>{selDate.year + '年' + (selDate.month < 10 ? '0' + selDate.month : selDate.month) + '月'} </View>
        <View className='head-icon head-next-month'></View>
        {showToday && <View className='go-to-today'>今</View>}
      </View>
      <View className='week-area'>
        {weekArr.map((item, index) => {
          return (
            <View className='week-font' key={index}>
              {item}
            </View>
          )
        })}
      </View>
      <Swiper
        className='calendar-data'
        circular
        duration={tranDuration}
        current={1}
        onChange={swiperChange}
        onAnimationFinish={swiperEndChange}
        style={{ height: `${shrinkType ? 56 : 266}px` }}
      >
        {_allData.map((a, index) => {
          console.log(a)
          return <SwiperItemNode selDate={selDate} shrinkType={shrinkType} days={a} key={index} />
        })}
      </Swiper>
      <View className='shrink' onClick={changeShrink}>
        <Text className={classNames('shrink-btn', { ['shrink-open']: shrinkType, ['shrink-close']: !shrinkType })}></Text>
      </View>
    </View>
  )
}

export default Calendartest
