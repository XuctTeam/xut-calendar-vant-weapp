import { Picker, Swiper, SwiperItem, View } from '@tarojs/components'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { CustCalendarInstance, CustCalendarProps, DayType } from './type'
import { getCurrentDayDetail, getMonthDays, getCurMonthViewDetail, getCurWeekViewDetail, getWeekDayList, getWeekDays, textFormat, string2Date } from './utils'
import Days from './Days'
import './index.less'

const CustCalendar = forwardRef<CustCalendarInstance, CustCalendarProps>((props, ref) => {
  /** 绑在实例上的方法，外界可直接使用 */
  useImperativeHandle(ref, (): CustCalendarInstance => {
    return {
      goNext,
      goPre
    }
  })
  const {
    view = 'month',
    isVertical = false,
    startWeekDay = 1,
    hideController = false,
    hideArrow = false,
    pickerTextGenerator,
    monthWrapHeigh = '16rem',
    weekWrapHeight = '3rem',
    selectedDateColor,
    marks = [],
    mode = 'normal',
    selectedDate,
    currentView,
    format = 'YYYY-MM-DD',
    minDate = '1970-01-01',
    maxDate = '2100-12-31',
    isSwiper = true,
    onDayClick,
    extraInfo = [],
    custDayRender,
    className,
    custWeekRender,
    onCurrentViewChange
  } = props
  /** 当前锁定的 SwiperItem */
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(1)
  /** 当天的数据 */
  const currentDayDetail = getCurrentDayDetail()
  console.log(currentDayDetail, 'currentDayDetail')
  const [selectedDay, setSelectedDay] = useState(dayjs(selectedDate).format('YYYY-MM-DD'))

  /** 当前显示的月份/周 所包含的一个日期 YYYY-MM-DD */
  const [dayViewDetail, setDayViewDetail] = useState(currentView ? string2Date(currentView) : currentDayDetail)

  const [today] = useState(currentDayDetail)

  const goNext = () => {
    const nextViewDetail =
      view === 'month'
        ? getCurMonthViewDetail(dayViewDetail.year, dayViewDetail.month + 1)
        : getCurWeekViewDetail(dayViewDetail.year, dayViewDetail.month, dayViewDetail.day + 7)

    const dayView = { ...dayViewDetail, ...nextViewDetail }
    setDayViewDetail(dayView)
    setCurrentCarouselIndex((currentCarouselIndex + 1) % 3)
    // 回调当前日期
    !!onCurrentViewChange && onCurrentViewChange(dayjs(`${dayView.year}-${dayView.month}`).format(format.substring(0, 7)))
  }
  const goPre = () => {
    const preViewDetail =
      view === 'month'
        ? getCurMonthViewDetail(dayViewDetail.year, dayViewDetail.month - 1)
        : getCurWeekViewDetail(dayViewDetail.year, dayViewDetail.month, dayViewDetail.day - 7)
    const dayView = { ...dayViewDetail, ...preViewDetail }
    setDayViewDetail(dayView)
    setCurrentCarouselIndex((currentCarouselIndex + 2) % 3)
    // 回调当前日期
    !!onCurrentViewChange && onCurrentViewChange(dayjs(`${dayView.year}-${dayView.month}`).format(format.substring(0, 7)))
  }
  const onSwiperChange = (e: any) => {
    if (e.detail.source === 'touch') {
      const currentIndex = e.detail.current
      ;(currentCarouselIndex + 1) % 3 === currentIndex ? goNext() : goPre()
    }
  }

  /** 日历滑块中的数据 */
  const daysArr: DayType[][] = useMemo(() => {
    const curMonthDays: DayType[] =
      view === 'month'
        ? getMonthDays(dayViewDetail.year, dayViewDetail.month, startWeekDay)
        : getWeekDays(dayViewDetail.year, dayViewDetail.month, dayViewDetail.day, startWeekDay)
    return [curMonthDays, curMonthDays, curMonthDays]
    setCurrentCarouselIndex(1)
  }, [dayViewDetail.year, dayViewDetail.month, dayViewDetail.day, startWeekDay, view])

  console.log(daysArr, 'render -------------------------------->')

  const weekList = useMemo(() => getWeekDayList(startWeekDay), [startWeekDay])
  /** picker 切换 更新当前日历 */
  const onPickerChange = (e: any) => {
    setDayViewDetail(string2Date(dayjs(e.detail.value).format(format)))
  }
  const getCurrentMonth = () => {
    return dayjs(`${dayViewDetail.year}-${dayViewDetail.month}`).format(format.substring(0, 7))
  }

  const current = useMemo(() => {
    const current = dayjs(selectedDate).toDate()
    return { year: current.getFullYear(), month: current.getMonth(), day: current.getDay(), weekDay: 1 }
  }, [selectedDate])

  const getPickerText = () => {
    if (view === 'month') return getCurrentMonth()
    const startDay = (daysArr[0] && daysArr[0][0]) ?? current
    const endDay = (daysArr[0] && daysArr[0][daysArr[0].length - 1]) ?? current
    return textFormat(startDay, format) + '~' + textFormat(endDay, format)
  }

  useEffect(() => {
    if (dayjs(selectedDate).isSame(dayjs(selectedDay))) {
      return
    }
    const diff = diffMonth(dayjs(selectedDate).toDate(), dayjs(selectedDay).toDate())
    if (diff === -1) {
      goPre()
    }
    if (diff === 1) {
      goNext()
    }
    setSelectedDay(dayjs(selectedDate).format('YYYY-MM-DD'))
  }, [selectedDate, selectedDay])

  const diffMonth = (firstDay: Date, secondDay: Date) => {
    const firstYear = firstDay.getFullYear()
    const firstMonth = firstDay.getMonth() + 1
    const secondYear = secondDay.getFullYear()
    const secondMonth = secondDay.getMonth() + 1
    if ((firstYear === dayViewDetail.year && firstMonth === dayViewDetail.month) || (firstYear === secondYear && firstMonth === secondMonth)) {
      return 0
    }
    if (firstYear < secondYear) {
      return -1
    }
    if (firstYear === secondYear && firstMonth < secondMonth) {
      return -1
    }
    return 1
  }

  const onCalendarClickDay = (info: DayType, dateFormate: string) => {
    onDayClick && onDayClick(info, dateFormate)
  }

  const bodyProps = {
    view,
    dayViewDetail,
    onDayClick: onCalendarClickDay,
    selectedDateColor,
    today,
    marks,
    selectedDate: selectedDay,
    minDate,
    maxDate,
    format,
    extraInfo,
    mode,
    custDayRender
  }

  return (
    <View className={`cust-calendar ${className}`}>
      {!hideController && (
        <View className='calendar-picker'>
          {!hideArrow && (
            <View className='calendar-arrow-wrap'>
              <View className='calendar-arrow calendar-arrow-left' onClick={goPre} />
            </View>
          )}
          <Picker
            mode='date'
            onChange={onPickerChange}
            value={view === 'month' ? getCurrentMonth() : textFormat((daysArr[0] && daysArr[0][0]) ?? current, format)}
            fields={view === 'month' ? 'month' : 'day'}
            start={minDate}
            end={maxDate}
          >
            {pickerTextGenerator ? pickerTextGenerator(getPickerText()) : getPickerText()}
          </Picker>
          {!hideArrow && (
            <View className='calendar-arrow-wrap'>
              <View className='calendar-arrow calendar-arrow-right' onClick={goNext} />
            </View>
          )}
        </View>
      )}
      <View className='week-desc'>
        {weekList.map((item) => {
          return (
            <View key={item} className='week-desc-item'>
              {custWeekRender ? custWeekRender(item) : item}
            </View>
          )
        })}
      </View>
      {isSwiper ? (
        <Swiper
          vertical={isVertical}
          circular
          current={currentCarouselIndex}
          onChange={onSwiperChange}
          style={{
            height: view === 'month' ? monthWrapHeigh : weekWrapHeight
          }}
        >
          {daysArr.map((item, index) => {
            return (
              <SwiperItem key={view + index}>
                <View>{currentCarouselIndex === index && <Days days={item} {...bodyProps} />}</View>
              </SwiperItem>
            )
          })}
        </Swiper>
      ) : (
        <Days days={daysArr[1] ?? []} {...bodyProps} />
      )}
    </View>
  )
})

CustCalendar.displayName = 'CustCalendar'
export default CustCalendar
