/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-04-02 09:02:31
 * @LastEditTime: 2022-11-14 10:24:01
 * @LastEditors: Derek Xu
 */
import { Cell, CellGroup } from '@antmjs/vantui'
import { FunctionComponent, useEffect, useState } from 'react'

interface IPageOption {
  status: number
  operation: number
  content: JSON | null
}

const EventBody: FunctionComponent<IPageOption> = (props) => {
  const [summary, setSummary] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [createMemberName, setCreateMemberName] = useState<string>('')

  useEffect(() => {
    if (!props.content) return
    if (props.content['summary']) {
      setSummary(props.content['summary'])
    }
    if (props.content['location']) {
      setLocation(props.content['location'])
    }
    if (props.content['startDate']) {
      setStartDate(props.content['startDate'])
    }
    if (props.content['createMemberName']) {
      setCreateMemberName(props.content['createMemberName'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*0.新建邀请 1.更新邀请 2.事件删除 3.事件提醒 */
  const getType = () => {
    switch (props.operation) {
      case 0:
        return '新建邀请'
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

  return (
    <CellGroup inset>
      <Cell title='分类'>日程消息</Cell>
      <Cell title='类型'>{getType()}</Cell>
      <Cell title='状态'>{props.status === 0 ? '未读' : '已读'}</Cell>
      <Cell title='标题'>{summary}</Cell>
      <Cell title='地点'>{location}</Cell>
      <Cell title='开始时间'>{startDate}</Cell>
      <Cell title='组织者'>{createMemberName}</Cell>
    </CellGroup>
  )
}

export default EventBody
