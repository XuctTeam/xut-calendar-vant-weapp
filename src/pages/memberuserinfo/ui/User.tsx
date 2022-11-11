/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-05 13:27:57
 * @LastEditTime: 2022-11-11 10:54:59
 * @LastEditors: Derek Xu
 */
import { FunctionComponent } from 'react'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Avatar from '@/components/avatar'
import { Icon } from '@antmjs/vantui'

interface IPageOption {
  hasLogin: boolean
  nickname: string
  avatar?: string
  to: () => void
}

const User: FunctionComponent<IPageOption> = (props) => {
  const { hasLogin, nickname, avatar, to } = props
  return (
    <View className='head'>
      <View className='info'>
        <Avatar src={avatar} size='large' shape='circle' />
        <View className='top'>
          {!hasLogin ? (
            <View className='top-info' onClick={to}>
              <View className='top-info_need'>立即登录</View>
              <View className='top-info_text'>登录后才可以创建、管理日程</View>
            </View>
          ) : (
            <View className='top-refresh'>
              <View className='top-user'>欢迎: {nickname}</View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
export default User
