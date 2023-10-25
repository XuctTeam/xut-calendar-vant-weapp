import dayjs from 'dayjs'

// #region Calendar
declare namespace Calendar {
  export type DateArg = string | number | Date

  export type classNameType = string | Array<string> | { [key: string]: boolean }

  export interface Mark {
    value: DateArg
  }

  export interface ValidDate {
    value: DateArg
  }

  export interface ExtraDate {
    holidays: any
    lunar: string
    lunarHoliday: any
    lunarTerms: string
    solarHoliday: any
    week: number
  }
  export interface Item {
    value: string

    _value: dayjs.Dayjs

    text: number

    type: number

    marks: Array<Mark>

    extra?: ExtraDate

    isActive?: boolean

    isToday?: boolean

    isBeforeMin?: boolean

    isAfterMax?: boolean

    isDisabled?: boolean

    isSelected?: boolean

    isSelectedHead?: boolean

    isSelectedTail?: boolean
  }

  export interface GroupOptions {
    validDates: Array<ValidDate>

    marks: Array<Mark>

    format: string

    monday: boolean

    selectedDates: Array<SelectedDate>

    minDate?: DateArg

    maxDate?: DateArg
  }

  export type List<T> = Array<T>

  export type ListInfo<T> = {
    value: number

    list: List<T>
  }

  export interface SelectedDate {
    end?: Calendar.DateArg

    start: Calendar.DateArg
  }
}

export default Calendar
export { Calendar }
// #endregion

// #region AtCalendar
export interface AtCalendarPropsBase {
  format?: string

  validDates?: Array<Calendar.ValidDate>

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  isSwiper?: boolean

  marks?: Array<Calendar.Mark>

  monthFormat?: string

  hideArrow?: boolean

  isVertical?: boolean

  className?: Calendar.classNameType

  onClickPreMonth?: () => void

  onClickNextMonth?: () => void

  onSelectDate?: (item: { value: Calendar.SelectedDate }) => void

  onDayClick?: (item: { value: string }) => void

  onDayLongClick?: (item: { value: string }) => void

  onMonthChange?: (value: string) => void
}

export interface AtCalendarSingleSelectedProps extends AtCalendarPropsBase {
  view?: 'month' | 'week'

  isMultiSelect?: false

  currentDate?: Calendar.DateArg
}

export interface AtCalendarMutilSelectedProps extends AtCalendarPropsBase {
  view?: 'month' | 'week'

  isMultiSelect?: true

  currentDate?: Calendar.SelectedDate
}

export type AtCalendarProps = AtCalendarSingleSelectedProps | AtCalendarMutilSelectedProps

export interface AtCalendarDefaultProps {
  view?: 'month' | 'week'

  format: string

  isSwiper: boolean

  validDates: Array<Calendar.ValidDate>

  marks: Array<Calendar.Mark>

  currentDate: Calendar.DateArg | Calendar.SelectedDate

  monthFormat: string

  hideArrow: boolean

  isVertical: boolean

  isMultiSelect: boolean

  selectedDates: Array<Calendar.SelectedDate>

  monday: boolean

  lunar: boolean
}

export interface AtCalendarState {
  generateDate: number

  selectedDate: Calendar.SelectedDate
}

export type AtCalendarPropsWithDefaults = AtCalendarProps & AtCalendarDefaultProps
// #endregion

// #region AtCalendarController
export interface AtCalendarControllerProps {
  generateDate: Calendar.DateArg

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  hideArrow: boolean

  monthFormat: string

  onPreMonth: () => void

  onNextMonth: () => void

  onSelectDate: (e: any) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AtCalendarControllerState {}
// #endregion

// #region AtCalendarBody
export type AtCalendarBodyListGroup = Array<Calendar.ListInfo<Calendar.Item>>

export interface AtCalendarBodyProps {
  view: 'month' | 'week'

  format: string

  validDates: Array<Calendar.ValidDate>

  marks: Array<Calendar.Mark>

  isSwiper: boolean

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  isVertical: boolean

  generateDate: number

  monday: boolean

  lunar: boolean

  selectedDate: Calendar.SelectedDate

  selectedDates: Array<Calendar.SelectedDate> | []

  onDayClick: (item: Calendar.Item) => void

  onSwipeMonth: (vectorCount: number) => void

  onLongClick: (item: Calendar.Item) => void
}

export interface AtCalendarBodyState {
  isAnimate: boolean

  offsetSize: number

  listGroup: AtCalendarBodyListGroup
}
// #endregion