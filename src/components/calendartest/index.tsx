import { Swiper, View, Text } from '@tarojs/components'
import classNames from 'classnames'
import React, { Component } from 'react'
import solarLunar from 'solarlunar-es'
import SwiperItemNode from './ui/SwiperItemNode'
import './index.less'

interface IPageState {
  currentDay: Date
  firstDayOfWeek?: string //每周的周几为第一天
  signList?: any[] //标记
  weekend?: Boolean //周末标红
  shrinkState?: string // 默认打开状态（收起或展开）
  showLunar?: Boolean //是否显示农历,
  showMonthBg?: Boolean //是否显示月份背景
  showChangeBtn?: Boolean
  weekType?: string
}

interface State {
  weekArr: string[]
  today: CALENDAR.DAY
  selDate: CALENDAR.DAY
  allMonthList: any[]
  tranIndex: number
  allWeekList: any[]
  tranCurrent: number
  tranDuration: number
  signArr: any[]
  showToday: Boolean
  shrinkType: Boolean
  deterChange: Boolean
}

export default class calendartest extends React.Component<IPageState, Readonly<State>> {
  //defaultProps 可以为 Class 组件添加默认 props,基于 static 的写法
  static defaultProps = {
    showLunar: false,
    showMonthBg: true,
    showChangeBtn: true,
    firstDayOfWeek: 'monday',
    weekend: true,
    shrinkState: 'month',
    weekType: '周'
  }

  public constructor(props: IPageState) {
    super(props)

    this.state = {
      weekArr: ['一', '二', '三', '四', '五', '六', '日'], //星期数组
      today: { year: 0, month: 0, day: 0 }, //今天日期 -> year, month, day
      selDate: { year: 0, month: 0, day: 0 }, //选中日期信息 -> year, month, day

      allMonthList: [], // 月份数据 -> [[[周],[周]],[月],[月]]
      tranIndex: 1, // 月份轮播所在位置
      allWeekList: [], // 周月份数据 -> [[[周]],[月],[月]]
      tranCurrent: 1, // 周轮播所在位置
      tranDuration: 300, //轮播时间(单位毫秒)
      signArr: props.signList || [], // 标记列表
      showToday: false, //显示回到今天(非当月才显示)
      shrinkType: false, // 收缩状态，true:收起(显示周)，false展开(显示月)
      deterChange: true // 防止切换月份过快
    }

    this.initDate = this.initDate.bind(this)
    this.getMonthData = this.getMonthData.bind(this)
    this.getDayInfo = this.getDayInfo.bind(this)
    this.getAllWeekData = this.getAllWeekData.bind(this)
    this.getOtherData = this.getOtherData.bind(this)
    this.getWeekData = this.getWeekData.bind(this)
    this.getOtherWeekData = this.getOtherWeekData.bind(this)
    this.getSignByDate = this.getSignByDate.bind(this)
    this.getDayClass = this.getDayClass.bind(this)
    this.getTranIndex = this.getTranIndex.bind(this)
    this.getDateByDateAndDay = this.getDateByDateAndDay.bind(this)
    this.returnDayChange = this.returnDayChange.bind(this)
    this.getMonthDate = this.getMonthDate.bind(this)
    this.returnShrinkChange = this.returnShrinkChange.bind(this)
    this.returnMonthChange = this.returnMonthChange.bind(this)
    this.swiperEndChange = this.swiperEndChange.bind(this)
    this.changeShrink = this.changeShrink.bind(this)
    this.judgeShowToday = this.judgeShowToday.bind(this)
    this.swiperChange = this.swiperChange.bind(this)
  }

  componentDidMount(): void {
    const _day = {
      year: this.props.currentDay.getFullYear(),
      month: this.props.currentDay.getMonth() + 1,
      day: this.props.currentDay.getDate()
    }
    this.setState({
      today: _day
    })
    if (this.props.firstDayOfWeek == 'sunday') {
      this.setState({
        weekArr: ['日', '一', '二', '三', '四', '五', '六']
      })
    }
    this.initDate(_day)
  }

  initDate(now: any) {
    const selDate = JSON.parse(JSON.stringify(now))
    this.setState({
      selDate
    })
    let monthList = this.getMonthData(selDate) // 获取当月数据
    let prevMonthList = this.getMonthData(this.getMonthDate(selDate, -1)) // 上月数据
    let nextMonthList = this.getMonthData(this.getMonthDate(selDate)) // 下月数据
    this.setState({
      allMonthList: [prevMonthList, monthList, nextMonthList],
      tranIndex: 1
    })
    if (this.props.shrinkState == 'week' && !this.state.shrinkType) {
      this.changeShrink()
    }
  }

  /**
   * 根据指定日期获取当月的数据
   * @param {Object} date = { year, month, day } 指定的日期
   */
  getMonthData(date: CALENDAR.DAY) {
    const { year, month, day } = date //指定的日期
    let maxDay = new Date(year, month, 0).getDate() //当前月最大日期
    let firstWeek = new Date(year + '/' + month + '/1').getDay() //月份1号的星期数
    if (this.props.firstDayOfWeek == 'monday') {
      firstWeek = firstWeek - 1 < 0 ? 6 : firstWeek - 1
    }
    let list = []
    //每月显示42天，6周，每周7天
    for (var i = 0; i < 42; i++) {
      let dayInfo = {} // 每天的详细信息
      if (i < firstWeek) {
        //指定月份上月的最后几天
        let { year, month } = this.getMonthDate(date, -1)
        let preMaxDay = new Date(year, month, 0).getDate() //上月最大日期
        let day = preMaxDay - firstWeek + i + 1
        dayInfo = this.getDayInfo({ year, month, day }, 'prev')
      } else if (i > maxDay + firstWeek - 1) {
        //指定月份下月的前几天
        let { year, month } = this.getMonthDate(date)
        let day = i - maxDay - firstWeek + 1
        dayInfo = this.getDayInfo({ year, month, day }, 'next')
      } else {
        let day = i - firstWeek + 1
        dayInfo = this.getDayInfo({ year, month, day }, 'normal')
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
  getDayInfo(date, dayType) {
    const { year, month, day } = date
    let isToday = false //是否今天
    if (year == this.state.today.year && month == this.state.today.month && day == this.state.today.day) isToday = true
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
      sign: this.getSignByDate(date)
    }
    let dayClass = this.getDayClass(dayInfo)
    dayInfo['dayClass'] = dayClass
    return dayInfo
  }

  // 点击收缩按钮，切换显示月份或显示周
  changeShrink() {
    const _shrinkType = !this.state.shrinkType
    this.setState({
      shrinkType: _shrinkType
    })

    if (this.state.tranDuration != 0) {
      this.setState({
        tranDuration: 0
      })
    }
    if (_shrinkType) {
      this.setState({
        tranCurrent: 1
      })
      this.getAllWeekData()
    }
    this.returnShrinkChange()
    this.judgeShowToday()
  }

  // 根据月份数据获取周数据，相当初始化周数据

  getAllWeekData() {
    const { prevNum, nowNum, nextNum } = this.getTranIndex('month', 1)
    const { year: selYear, month: selMonth, day: selDay } = this.state.selDate
    let sDate = selYear + '-' + selMonth + '-' + selDay // 选中的日期
    let allWeekList = [[], [], []]
    let prevMonthList = this.state.allMonthList[prevNum]
    let nowMonthList = this.state.allMonthList[nowNum]
    let nextMonthList = this.state.allMonthList[nextNum]
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
    this.setState({
      allWeekList
    })
  }

  /**
   * 获取月份数据
   * @param {String} type=[pre|next]
   */
  getOtherData(type: string, nowCurrent: number) {
    let nowMont = this.getMonthDate(this.state.selDate, type == 'prev' ? -1 : 1) // 获取当前月份
    // 切换月份后设置选中的日期
    this.setState({
      selDate: nowMont
    })
    debugger
    let monthData = this.getMonthData(this.getMonthDate(nowMont, type == 'prev' ? -1 : 1))
    // 获取上月或下月轮播所在位置
    let current = this.getTranIndex(type, nowCurrent).prevNum
    if (type == 'next') current = this.getTranIndex(type, nowCurrent).nextNum
    const _allMonthList = [...this.state.allMonthList]
    _allMonthList.splice(current, 1, monthData)
    this.setState({
      allMonthList: _allMonthList
    })
    this.judgeShowToday()
    this.returnMonthChange(type)
  }

  // 从月历中获取周数据，切换周后获取上周或下周数据
  getWeekData(type) {
    const { prevNum: prevIndex, nowNum: nowIndex, nextNum: nextIndex } = this.getTranIndex('month', 1)
    const { prevNum: prevCurrent, nowNum: nowCurrent, nextNum: nextCurrent } = this.getTranIndex('week', 1)
    const { year: selYear, month: selMonth, day: selDay } = this.state.selDate
    let sDate = selYear + '-' + selMonth + '-' + selDay
    let prevMonthList = this.state.allMonthList[prevIndex]
    let nowMonthList = this.state.allMonthList[nowIndex]
    let nextMonthList = this.state.allMonthList[nextIndex]
    for (let i = 0; i < nowMonthList.length; i++) {
      for (let j = 0; j < nowMonthList[i].length; j++) {
        if (sDate == nowMonthList[i][j].date) {
          this.returnDayChange(nowMonthList[i][j]) // 返回选中的日期
          if (type == 'next') {
            this.state.allWeekList.splice(nextCurrent, 1, [nowMonthList[i + 1]])
            if (i == 5) this.state.allWeekList.splice(nextCurrent, 1, [nextMonthList[1]])
          } else {
            this.state.allWeekList.splice(prevCurrent, 1, [nowMonthList[i - 1]])
            if (i == 0) {
              for (let k = prevMonthList.length - 1; k >= 0; k--) {
                if (prevMonthList[k][6].dayType == 'normal') {
                  this.state.allWeekList.splice(prevCurrent, 1, [prevMonthList[k]])
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
  getOtherWeekData(type) {
    let oldSel = this.state.selDate // 原选中的日期
    let newSel = this.getDateByDateAndDay(oldSel, type == 'prev' ? -7 : 7) // 获取7天前或后的日期
    if (oldSel.month != newSel.month) {
      // 跨月，先设置跨月后的月历
      // 设置月轮播位置
      let current = this.getTranIndex('month', 1).prevNum
      if (type == 'next') current = this.getTranIndex('month', 1).nextNum
      this.setState({
        tranIndex: current
      })
      this.getOtherData(type, 1)
    }
    this.setState({
      selDate: newSel
    })
    this.getWeekData(type)
    this.judgeShowToday()
  }

  /**
   * 根据日期获取日期对应的事件
   * @param {Object} date = { year, month, day } 指定的日期
   */
  getSignByDate(date) {
    const { year, month, day } = date
    let dayDateS = new Date(year + '/' + month + '/' + day + ' 00:00:00').getTime()
    let dayDateE = new Date(year + '/' + month + '/' + day + ' 23:59:59').getTime()
    let daySign = []
    this.state.signArr.map((sign) => {
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
  getDayClass(dayInfo) {
    let dClass = ''
    if (dayInfo.isToday) dClass += ' is-today' // 今天日期
    if (dayInfo.isHoliday) dClass += ' is-holiday' // 法定假日
    if (this.props.weekend && (dayInfo.week == 0 || dayInfo.week == 6)) dClass += ' week-end' // 周末标红
    return dClass
  }

  /**
   * 获取上一个或下一个轮播位置
   * @param {String} type = [month|week] 轮播类型，月轮播(tranIndex),周轮播(tranCurrent)
   * @returns {Object} {prevNum, nowNum, nextNum}
   */
  getTranIndex(type = 'month', nowCurrent: number) {
    let current = nowCurrent
    // if (type == 'week') {
    //   current = this.state.tranCurrent
    // }
    let prevNum = current - 1 < 0 ? 2 : current - 1
    let nowNum = current
    let nextNum = current + 1 > 2 ? 0 : current + 1
    debugger
    return { prevNum, nowNum, nextNum }
  }

  /**
   * 根据日期获取几天后的日期
   * @param {Object} date = {year, month, day} 当前日期
   * @param {Number} day 当前日期的几天前或几天后(负数)
   * @returns {Object} {year, month, day}
   */
  getDateByDateAndDay(date, num) {
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
  getMonthDate(date, num = 1) {
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
  judgeShowToday() {
    const { year, month, day } = this.state.today
    const { year: selYeat, month: selMonth, day: selDay } = this.state.selDate
    if (this.state.shrinkType) {
      // 显示的周
      let selTimes = new Date(selYeat, selMonth - 1, selDay).getTime() // 选中日期的时间戳
      let week = new Date(year, month - 1, day).getDay() // 今天星期
      let firstWD = this.getDateByDateAndDay(this.state.today, -week + (this.props.firstDayOfWeek == 'monday' ? 1 : 0))
      let lastWD = this.getDateByDateAndDay(this.state.today, 6 - week + (this.props.firstDayOfWeek == 'monday' ? 1 : 0))
      let firstTimes = new Date(firstWD.year, firstWD.month - 1, firstWD.day).getTime()
      let lastTimes = new Date(lastWD.year, lastWD.month - 1, lastWD.day).getTime()
      if (selTimes > lastTimes || selTimes < firstTimes) {
        this.setState({
          showToday: true
        })
        return
      }
      this.setState({
        showToday: false
      })
    } else {
      if (year != selYeat || month != selMonth) {
        this.setState({
          showToday: true
        })
        return
      }
      this.setState({
        showToday: false
      })
    }
  }

  /**
   * 事件 - 设置返回日期
   * @param {Object} dayInfo 日期详情
   */
  returnDayChange(dayInfo) {
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
    if (this.props.showLunar) returnData['lunar'] = dayInfo.lunar
    //this.$emit('dayChange', returnData)
  }

  /**
   * 事件 - 返回收缩状态
   */
  returnShrinkChange() {
    let type = this.state.shrinkType ? 'week' : 'month'
    //this.$emit("shrinkClick", type);
  }

  /**
   * 事件 - 设置返回月份
   * @param {String} type 类型
   */
  returnMonthChange(type) {
    let _selDate = this.state.selDate.year + '-' + this.state.selDate.month + '-' + this.state.selDate.day
    let monthList = this.state.allMonthList.flat().flat() // 二维转一维
    let dayInfo = monthList.find((day) => day.date == _selDate)
    this.returnDayChange(dayInfo)
    // this.$emit("monthChange", {
    //   year: dayInfo.year,
    //   month: dayInfo.month,
    //   type: type
    // });
  }

  /**
   * 滑动切换月份或周
   */
  swiperChange(e) {
    let current = e.detail.current
    let oldIndex = this.state.shrinkType ? this.state.tranCurrent : this.state.tranIndex
    let type = oldIndex - current == -1 || oldIndex - current == 2 ? 'next' : 'prev'
    if (this.state.shrinkType) {
      this.setState({
        tranCurrent: current
      })
      if (current != oldIndex) {
        this.getOtherWeekData(type)
      }
    } else {
      this.setState({
        tranIndex: current
      })
      if (current != oldIndex) {
        this.getOtherData(type, current)
      }
    }
  }

  // 滑动切换结束
  swiperEndChange() {
    this.setState({
      tranDuration: 300
    })
  }

  get allData() {
    return this.state.shrinkType ? this.state.allWeekList : this.state.allMonthList
  }

  render() {
    return (
      <View className='lunc-calendar'>
        <View className='header'>
          {this.props.showChangeBtn && <View className='head-icon head-pre-month' />}

          <View className='head-month'>
            {this.state.selDate.year + '年' + (this.state.selDate.month < 10 ? '0' + this.state.selDate.month : this.state.selDate.month) + '月'}{' '}
          </View>
          {this.props.showChangeBtn && <View className='head-icon head-next-month'></View>}

          {this.state.showToday && <View className='go-to-today'>今</View>}
        </View>
        <View className='week-area'>
          {this.state.weekArr.map((item, index) => {
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
          duration={this.state.tranDuration}
          current={this.state.shrinkType ? this.state.tranCurrent : this.state.tranIndex}
          onChange={this.swiperChange}
          onAnimationFinish={this.swiperEndChange}
          style={{ height: `${this.state.shrinkType ? 56 : 266}px` }}
        >
          {this.allData.map((a, index) => {
            return (
              <SwiperItemNode showBg={this.props.showMonthBg || true} selDate={this.state.selDate} shrinkType={this.state.shrinkType} days={a} key={index} />
            )
          })}
        </Swiper>
        <View className='shrink' onClick={this.changeShrink}>
          <Text className={classNames('shrink-btn', { ['shrink-open']: this.state.shrinkType, ['shrink-close']: !this.state.shrinkType })}></Text>
        </View>
      </View>
    )
  }
}
