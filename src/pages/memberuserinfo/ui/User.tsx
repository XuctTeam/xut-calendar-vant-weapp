/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-05 13:27:57
 * @LastEditTime: 2023-10-18 08:52:20
 * @LastEditors: Derek Xu
 */
import { FC } from 'react'
import { View } from '@tarojs/components'
import Avatar from '@/components/avatar'

interface IPageOption {
  hasLogin: boolean
  nickname: string
  avatar?: string
  to: () => void
}

const User: FC<IPageOption> = ({ hasLogin, nickname, avatar, to }) => {
  return (
    <View className='info'>
      <View className='info-box'>
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
