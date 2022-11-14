/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-26 08:48:25
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 10:24:38
 */
import { Cell } from '@antmjs/vantui'
import { FunctionComponent, useCallback } from 'react'

interface IPageOption {
  status: number
  operation: number
  content: JSON | null
}

const SystemBody: FunctionComponent<IPageOption> = (props) => {
  const getType = () => {
    switch (props.operation) {
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

  const getContent = useCallback(() => {
    if (!props.content) return
    if (props.operation === 0 || props.operation === 1 || props.operation === 2 || props.operation === 3) {
      return props.content['user_name']
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content])

  return (
    <>
      <Cell title='分类'>系统消息</Cell>
      <Cell title='类型'>{getType()}</Cell>
      <Cell title='状态'>{props.status === 0 ? '未读' : '已读'}</Cell>
      <Cell title='消息内容'> {getContent()}</Cell>
    </>
  )
}

export default SystemBody
