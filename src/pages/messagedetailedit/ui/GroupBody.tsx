/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-26 08:41:18
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 10:24:21
 */
import { Cell } from '@antmjs/vantui'
import { Fragment, FunctionComponent } from 'react'

interface IPageOption {
  status: number
  operation: number
  content: JSON | null
}

const GroupBody: FunctionComponent<IPageOption> = (props) => {
  const getType = () => {
    switch (props.operation) {
      case 0:
        return '申请入组'
      case 1:
        return '同意入组'
      case 2:
        return '拒绝入组'
      case 3:
        return '撤回申请'
      case 4:
        return '离开群组'
      case 5:
        return '踢出群组'
      case 6:
        return '群组删除'
      default:
        return '未知'
    }
  }

  const convert = () => {
    switch (props.operation) {
      case 3:
        return <Cell title='群组名称'>{props.content && props.content['groupName']}</Cell>
    }
  }

  return (
    <>
      <Cell title='分类'>群组消息</Cell>
      <Cell title='类型'>{getType()}</Cell>
      <Cell title='状态'>{props.status === 0 ? '未读' : '已读'}</Cell>
      <>{convert()}</>
    </>
  )
}

export default GroupBody
