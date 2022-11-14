/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-02-21 15:28:49
 * @LastEditTime: 2022-11-14 13:46:05
 * @LastEditors: Derek Xu
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { IMessage } from 'types/message'
import { Cell, Tag } from '@antmjs/vantui'
import classnames from 'classnames'

interface IPageStateProps {
  message: IMessage
  viewHandler: (id: string, status: number) => void
}

const MessageBody: FunctionComponent<IPageStateProps> = (props) => {
  const { id, title, status, type, operation, createTime } = props.message

  const messageType = (type: string): string => {
    switch (type) {
      case 'SYSTEM':
        return '系统消息'
      case 'GROUP':
        return '群组消息'
      case 'EVENT':
        return '日程消息'
      default:
        return '其他消息'
    }
  }

  const operateType = (type: string, operate: number): string => {
    switch (type) {
      case 'SYSTEM':
        return operateSystemMessage(operate)
      case 'GROUP':
        return operateGroupMessage(operate)
      case 'EVENT':
        return operateEventMessage(operate)
      default:
        return '未知'
    }
  }

  const operateSystemMessage = (operate: number): string => {
    switch (operate) {
      case 0:
        return '注册消息'
      case 1:
        return '修改名称消息'
      case 2:
        return '使用微信头像昵称消息'
      case 3:
        return '账号合并消息'
      default:
        return '未知'
    }
  }

  const operateGroupMessage = (operate: number): string => {
    switch (operate) {
      case 0:
        return '申请入组'
      case 1:
        return '同意入组'
      case 2:
        return '拒绝入组'
      case 3:
        return '群组删除'
      default:
        return '未知'
    }
  }

  /** 0.新建邀请 1.更新邀请 2.事件删除 3.事件提醒  */
  const operateEventMessage = (operate: number): string => {
    switch (operate) {
      case 0:
        return '新增邀请'
      case 1:
        return '更新邀请'
      case 2:
        return '事件删除'
      case 3:
        return '事件提醒'
      default:
        return '未知'
    }
  }

  const getTagColor = (type: string) => {
    switch (type) {
      case 'SYSTEM':
        return 'success'
      case 'GROUP':
        return 'warning'
      case 'EVENT':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const view = () => {
    props.viewHandler(id || '', status)
  }

  return (
    <Cell onClick={() => view()} clickable className='cell'>
      <View className='title'>
        <View className='left'>
          <View className={classnames('read', { ['read-circle']: status === 0 })} />
          <View>{title}</View>
        </View>
        <View className='right'>
          <View>{operateType(type, operation)}</View>
        </View>
      </View>
      <View className='cell'>
        <Tag mark={true} type={getTagColor(type)}>
          {messageType(type)}
        </Tag>
        <View>{dayjs(createTime).format('YYYY-MM-DD HH:mm')}</View>
      </View>
    </Cell>
  )
}

export default MessageBody
