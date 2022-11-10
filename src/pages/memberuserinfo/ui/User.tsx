/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-05 13:27:57
 * @LastEditTime: 2022-11-10 18:21:17
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
}

const User: FunctionComponent<IPageOption> = (props) => {
  return (
    <View className='head'>
      <View className='info'>
        <Avatar src={props.avatar} size='medium' shape='circle' />
        <View className='top'>
          {!props.hasLogin ? (
            <View className='top-info' onClick={() => Router.toLogin()}>
              <View className='top-info_need'>立即登录</View>
              <View className='top-info_text'>登录后才可以创建、管理日程</View>
            </View>
          ) : (
            <View className='top-refresh'>
              <View className='top-user'>你好: {props.nickname}</View>
            </View>
          )}
        </View>
      </View>
      {props.hasLogin && <Icon className='icon' classPrefix='page-icon' name='xiaoxi' size='28px'></Icon>}
    </View>
  )
}
export default User
