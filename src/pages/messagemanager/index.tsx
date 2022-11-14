/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 18:25:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 14:26:09
 * @FilePath: \xut-calendar-vant-weapp\src\pages\messagemanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Container from '@/components/container'

import Unite from '@antmjs/unite'
import { View } from '@tarojs/components'
import { Dialog, Icon, PowerScrollView } from '@antmjs/vantui'
import { MessageBody, NoticeMsg } from './ui'
import { useNav } from '@/utils'
import { list, clear, read, count } from '@/api/message'
import { cacheGetSync } from '@/cache'
import { IMessage, IMessagePageComponent } from 'types/message'
import { useRef } from 'react'
import Router from 'tarojs-router-next'
import './index.less'

export default Unite(
  {
    state: {
      messages: [],
      finished: false,
      countNum: 0
    },
    async onLoad() {
      if (!this.hooks['accessToken']) {
        return
      }
      this.query()
      this._count()
    },

    async query() {
      list(this.hooks['pageRef'].current, 20, '')
        .then((res) => {
          const { finished, messages } = res as any as IMessagePageComponent
          this.setState({
            messages: [...this.state.messages, ...(messages as any as IMessage[])],
            finished
          })
          if (!finished) {
            this.hooks['pageRef'].current += 1
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    readAll() {
      Dialog.confirm({
        title: '提示',
        message: '确定清除全部消息？',
        selector: 'messageManagerDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this._readAll()
      })
    },

    async viewDetail(id: string, status: number) {
      if (status !== 1) {
        const msgIndex: number = this.state.messages.findIndex((m) => m.id === id)
        if (msgIndex < 0) return
        const msg: IMessage = this.state.messages.find((m) => m.id === id)
        if (!msg) return
        await read(id)
        const writeMessages: IMessage[] = [...this.state.messages]
        console.log(msgIndex)
        writeMessages.splice(msgIndex, 1, { ...msg, status: 1 })
        this.setState({
          messages: writeMessages
        })
      }
      let res
      try {
        res = await Router.toMessagedetailedit({
          params: {
            id
          }
        })
      } catch (err) {
        console.log(err)
      }
      if (!res) return
      const { isRemove } = res
      if (!isRemove) return
      const _messages = this.state.messages.filter((item) => item.id !== id)
      this.setState({
        messages: _messages
      })
    },

    _readAll() {
      clear()
        .then(() => {
          this.setState({
            messages: []
          })
          this.hooks['pageRef'].current = 0
          this.query()
          this._count()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _count() {
      count()
        .then((res) => {
          this.setState({
            countNum: res as any as number
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  function ({ state, events }) {
    const { messages, finished, countNum } = state
    const { query, readAll, viewDetail } = events
    const usedNav = useNav()
    const pageRef = useRef<number>(0)

    const accessToken = cacheGetSync('accessToken')
    events.setHooks({
      accessToken: accessToken,
      pageRef: pageRef
    })

    return (
      <Container navTitle='消息中心' className='page-message-manager-index' useNav={usedNav} useMenuBtns={usedNav} enablePagePullDownRefresh={false}>
        <View className='message-header'>
          <View className='all'>未读消息({countNum})</View>
          <View className='clean'>
            <Icon classPrefix='page-icon' name='zuixing-81' size={40} onClick={readAll} /> 清除未读
          </View>
        </View>
        <NoticeMsg></NoticeMsg>
        <View className='br'></View>
        <View className='list'>
          <PowerScrollView
            finishedText='没有更多了'
            successText='刷新成功'
            style={{ height: '100%' }}
            onScrollToLower={query}
            current={messages.length}
            refresherEnabled={false}
            finished={finished}
          >
            {messages.map((item, i) => (
              <MessageBody key={i} message={item} viewHandler={viewDetail}></MessageBody>
            ))}
          </PowerScrollView>
        </View>
        <Dialog id='messageManagerDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
