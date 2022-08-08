import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import { IDavComponent } from '~/../types/calendar'
import dayjs from 'dayjs'

interface IPagOption {
  color: string
  component: IDavComponent
  viewComponent: (component: IDavComponent) => void
  width: number
}

const DayEventData: FunctionComponent<IPagOption> = (props) => {
  return (
    <View className="item-event-detail" style={{ width: `${props.width}%` }}>
      <View
        className="box"
        onClick={() => props.viewComponent(props.component)}
      >
        <View
          className="color"
          style={{ background: `#${props.color}` }}
        ></View>
        <View className="content">
          <View className="title">{props.component.summary}</View>
          <View>
            {dayjs(props.component.dtstart).format('HH:mm') +
              '-' +
              dayjs(props.component.dtend).format('HH:mm')}
          </View>
        </View>
      </View>
    </View>
  )
}

export default DayEventData
