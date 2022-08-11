/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-07 21:52:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-11 19:17:18
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { IGroup } from 'types/group'
import { Button, Cell, Col, Row, Tag, Icon } from '@antmjs/vantui'
import Avatar from '@/components/avatar'

interface IPageStateProps {
  group: IGroup
  uid: string
  edit: (id: string) => void
  remove: (id: string) => void
  viewGroup: (id: string) => void
}

const GroupBody: FunctionComponent<IPageStateProps> = (props) => {
  const { id, name, createTime, images, count, createMemberId } = props.group

  return (
    <View className='box'>
      <View className='cell'>
        <Row className='row'>
          <Col span={4}>
            {images ? (
              <Avatar src={images} size='medium'></Avatar>
            ) : (
              <Avatar className='avatar' size='medium'>
                G
              </Avatar>
            )}
          </Col>
          <Col span={20}>
            <View className='title'>
              <View className='label'>{name}</View>
              <Tag color='warning'>{createMemberId === props.uid ? '群主' : '组员'}</Tag>
            </View>
            <View className='number row'>
              <View>
                <Icon color='red' name='friends-o'></Icon> {count} 人
              </View>
              <View className='time'>{dayjs(createTime).format('YYYY/MM/DD HH:mm:ss')}</View>
            </View>
          </Col>
        </Row>
      </View>
      <View className='lbr'></View>
      <View className='btns'>
        <Button
          type='info'
          disabled={props.uid !== createMemberId}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            props.edit(id || '')
          }}
        >
          编辑
        </Button>
        <Button
          type='danger'
          disabled={props.uid !== createMemberId}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            props.remove(id || '')
          }}
        >
          删除
        </Button>
      </View>
    </View>
  )
}

export default GroupBody
