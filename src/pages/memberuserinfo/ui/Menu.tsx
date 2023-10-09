/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-05 17:04:12
 * @LastEditTime: 2023-06-13 13:18:13
 * @LastEditors: Derek Xu
 */
import { FunctionComponent, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Cell } from '@antmjs/vantui'
import { useRequestSubscribeMessage, useToast } from 'taro-hooks'
import * as Router from 'tarojs-router-next'
import { useThrottle, useWebEnv } from '@/calendar/hooks/hooks'

interface IPageOption {
  accessToken: string
}

const Setting: FunctionComponent<IPageOption> = (props) => {
  const [requestSubscribeMessage] = useRequestSubscribeMessage()
  const env = useWebEnv()
  const [toast] = useToast({
    mask: true,
    duration: 1000,
    title: 'initial title',
    icon: 'success'
  })

  /**
   * 列表点击
   */
  const atListItemClickHandle = useThrottle((params: any) => {
    if (params === 1) {
      Router.toCalendarmanager()
    } else if (params === 2) {
      Router.toSystemsetting()
    } else if (params === 3) {
      _copy()
    } else if (params === 4) {
      Router.toOnlineservices()
    } else if (params === 5) {
      Router.toMemberaccount()
    } else if (params === 6) {
      _submissiveClickHandle()
    }
  }, 400)

  const _submissiveClickHandle = useCallback(async () => {
    console.log(env)
    if (!(props.accessToken && !env)) {
      toast({
        title: '请先登陆',
        icon: 'error'
      })
      return
    }
    let content = '订阅失败！'
    let flag = false
    const subscribeIds = process.env.TEMPLATE_ID?.IDS
    try {
      const { [subscribeIds]: result } = await requestSubscribeMessage(subscribeIds)
      if (result === 'accept') {
        content = '订阅成功！'
        flag = true
      }
    } catch (e) {
      console.log(e)
      content = '订阅失败！'
    }
    toast({
      title: content,
      icon: flag ? 'success' : 'error'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSubscribeMessage, toast])

  const _copy = () => {
    Taro.setClipboardData({
      data: 'xuct.com.cn',
      success: function () {
        Taro.showToast({
          title: '已复制网址',
          icon: 'success'
        })
      }
    })
  }

  return (
    <View className='setting'>
      {!env && <Cell icon='guide-o' title='消息订阅' isLink onClick={atListItemClickHandle.bind(this, 6)}></Cell>}
      <Cell title='我的日历' icon='calendar-o' isLink onClick={atListItemClickHandle.bind(this, 1)}></Cell>
      <Cell title='电脑版' icon='tv-o' isLink onClick={atListItemClickHandle.bind(this, 3)}>
        xuct.com.cn
      </Cell>
      <Cell title='在线客服' icon='contact' isLink onClick={atListItemClickHandle.bind(this, 4)}></Cell>
      <Cell title='设置' icon='setting-o' isLink onClick={atListItemClickHandle.bind(this, 2)}></Cell>
      <Cell title='账号与安全' icon='user-circle-o' isLink onClick={atListItemClickHandle.bind(this, 5)}></Cell>
    </View>
  )
}
export default Setting
