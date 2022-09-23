/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-05 14:22:09
 * @LastEditTime: 2022-09-23 17:23:20
 * @LastEditors: Derek Xu
 */
import dayjs from 'dayjs'
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { IDavComponent } from '~/../types/calendar'

interface IPageOption {
  current: number
  color?: string
  component: IDavComponent
  today: string
  selecteday: string
  viewComponent: (component: IDavComponent) => void
}

const EventData: FunctionComponent<IPageOption> = (props) => {
  const { color } = props.component || { color: '417ff9' }
  const sameDay = dayjs(props.today).isSame(props.selecteday, 'day')
  const startTime = dayjs(props.component.dtstart).valueOf()
  const currentTime = dayjs(props.current)

  const getEventTime = (): JSX.Element => {
    if (props.component.fullDay === 1) {
      return <></>
    }
    if (startTime < props.current) {
      return <View className='event-expire'>{dayjs(props.current).format('HH:mm')}</View>
    }
    const hour = dayjs(props.component.dtstart).diff(currentTime, 'hour')
    const minute = dayjs(props.component.dtstart).diff(currentTime, 'minute') - hour * 60
    if (hour > 0) {
      return (
        <View>
          {hour}小时{minute}分后
        </View>
      )
    }
    return <>{minute}分后</>
  }

  return (
    <View className='event-container event-item taroify-hairline--bottom' onClick={() => props.viewComponent(props.component)}>
      <View className='event-color' style={{ background: `#${color}` }}></View>
      <View className='event-title'>
        <View className='event-summary-container'> {props.component.summary} </View>
        <View className='event-time'>
          <View className='time-containe'>
            {props.component.fullDay === 1 ? '全天' : dayjs(props.component.dtstart).format('HH:mm') + '-' + dayjs(props.component.dtend).format('HH:mm')}
          </View>
          {sameDay && <View>{getEventTime()}</View>}
        </View>
      </View>
    </View>
  )
}

export default EventData
