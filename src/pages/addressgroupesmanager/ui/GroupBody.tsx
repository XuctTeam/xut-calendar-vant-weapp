/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-07 21:52:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-12 14:21:42
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import { IGroup } from 'types/group'
import { Button, Col, Row, Tag, Icon } from '@antmjs/vantui'
import Avatar from '@/components/avatar'

interface IPageStateProps {
  group: IGroup
  uid: string
  edit: (id: string) => void
  remove: (id: string) => void
  members: (id: string) => void
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
              <Tag type='warning'>{createMemberId === props.uid ? '群主' : '组员'}</Tag>
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
        <Row gutter={2}>
          <Col span='8'>
            <Button type='info' size='small' disabled={props.uid !== createMemberId} onClick={() => props.edit(id || '')}>
              编辑
            </Button>
          </Col>
          <Col span='8'>
            <Button type='danger' size='small' disabled={props.uid !== createMemberId} onClick={() => props.remove(id || '')}>
              删除
            </Button>
          </Col>
          <Col span='8'>
            <Button type='warning' size='small' onClick={() => props.members(id || '')}>
              组员
            </Button>
          </Col>
        </Row>
      </View>
    </View>
  )
}

export default GroupBody
