/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 10:21:30
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 13:40:10
 * @FilePath: \xut-calendar-vant-weapp\src\pages\messagedetailedit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Container from '@/components/container'
import Unite from '@antmjs/unite'
import { Button, Dialog, Loading, Overlay } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { EventBody, GroupBody, SystemBody } from './ui'
import { get, remove } from '@/api/message'
import { IMessage } from 'types/message'
import { useNav } from '@/utils'
import { useBack } from '@/utils/taro'
import './index.less'

export default Unite(
  {
    state: {
      id: '',
      type: 'GROUP',
      status: 0,
      operation: 1,
      content: null,
      saving: false
    },

    async onLoad() {
      const { id } = this.location.params
      if (id == null) return
      get(id)
        .then((res) => {
          this.setState({
            ...(res as any as IMessage)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    view() {
      switch (this.state.type) {
        case 'GROUP':
          return <GroupBody status={this.state.status} operation={this.state.operation} content={this.state.content}></GroupBody>
        case 'SYSTEM':
          return <SystemBody status={this.state.status} operation={this.state.operation} content={this.state.content}></SystemBody>
        case 'EVENT':
          return <EventBody status={this.state.status} operation={this.state.operation} content={this.state.content}></EventBody>
        default:
          return <></>
      }
    },

    remove() {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？',
        selector: 'messageDetailDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this._remove()
      })
    },

    _remove() {
      this.setState({
        saving: true
      })
      remove(this.state.id).then(() => {
        this.setState({
          saving: false
        })
        window.setTimeout(() => {
          this.hooks['back']({
            data: {
              isRemove: true
            }
          })
        }, 1500)
      })
    }
  },
  function ({ state, events }) {
    const { saving } = state
    const { view, remove } = events
    const usedNav = useNav()
    const [back] = useBack()

    events.setHooks({
      back: back
    })

    return (
      <Container navTitle='消息详情' className='pages-messagedetailedit-index' enablePagePullDownRefresh={false} useNav={usedNav} useMenuBtns={usedNav}>
        <View className='van-page-box'>{view()}</View>
        <View className='van-page-button' onClick={remove}>
          <Button type='danger' block>
            删除
          </Button>
        </View>
        <Dialog id='messageDetailDialog' />
        <Overlay show={saving}>
          <Loading size='24px' type='spinner' vertical color='#000'>
            加载中...
          </Loading>
        </Overlay>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
