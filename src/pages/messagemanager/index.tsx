/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 18:25:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-12 22:16:18
 * @FilePath: \xut-calendar-vant-weapp\src\pages\messagemanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Container from '@/components/container'

import Unite from '@antmjs/unite'
import { ScrollView, View } from '@tarojs/components'
import { Button, CellGroup, Empty, Icon, PowerScrollView } from '@antmjs/vantui'
import Router from 'tarojs-router-next'
import { MessageBody, NoticeMsg } from './ui'
import { useNav } from '@/utils'
import { list } from '@/api/message'
import './index.less'
import { cacheGetSync } from '@/cache'
import { IMessage, IMessagePageComponent } from 'types/message'
import { useRef } from 'react'

export default Unite(
  {
    state: {
      messages: [],
      finished: false
    },
    async onLoad() {
      if (!this.hooks['accessToken']) {
        return
      }
      this.query()
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

    _init() {
      this.setState({})
    }
  },
  function ({ state, events }) {
    const { messages, finished } = state
    const { query } = events
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
          <View className='all'>全部消息({0})</View>
          <View className='clean'>
            <Icon classPrefix='page-icon' name='zuixing-81' size={40} /> 清除未读
          </View>
        </View>
        <NoticeMsg></NoticeMsg>
        <View className='br'></View>
        <View className='list'>
          <PowerScrollView
            finishedText='没有更多了'
            successText='刷新成功'
            style={{ height: '100%' }}
            // onScrollToUpper={basicsDoRefresh}
            onScrollToLower={query}
            current={messages.length}
            refresherEnabled={false}
            finished={finished}
          >
            {messages.map((item, i) => (
              <MessageBody key={i} message={item} viewHandler={() => {}}></MessageBody>
            ))}
          </PowerScrollView>
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
