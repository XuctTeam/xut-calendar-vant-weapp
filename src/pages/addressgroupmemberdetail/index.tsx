/*
 * @Author: Derek Xu
 * @Date: 2022-11-09 21:56:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-09 22:18:41
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmemberdetail\index.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import Container from '@/components/container'
import Unite from '@antmjs/unite'
import { Button, Cell, Dialog } from '@antmjs/vantui'
import { useNav } from '@/utils'

import './index.less'
import { useRecoilValue } from 'recoil'
import { userInfoStore } from '@/store'
import Avatar from '@/components/avatar'
import dayjs from 'dayjs'

export default Unite(
  {
    state: {
      loading: true,
      groupId: '',
      memberId: '',
      avatar: '',
      name: '',
      joinDate: new Date()
    },

    async onLoad() {
      const { groupId, memberId } = this.location.params
      if (!(groupId && memberId)) return
      this._init()
    },

    _init() {
      // this.setState({
      //   loading: true
      // })
    },

    quitGroup() {
      const that = this
      Dialog.confirm({
        title: '提示',
        message: '确认退出吗？',
        selector: 'addressgroupmemberdetailDialog'
      }).then((value) => {
        if (value === 'cancel') return
        that._leaveGroup()
      })
    },

    _leaveGroup() {}
  },
  function ({ state, events }) {
    const { loading, avatar, name, memberId, joinDate } = state
    const { quitGroup } = events
    const _useNav = useNav()
    const userInfo = useRecoilValue(userInfoStore)

    events.setHooks({
      userInfo: userInfo
    })

    return (
      <Container
        navTitle='成员管理'
        enablePagePullDownRefresh={false}
        loading={loading}
        className='pages-address-group-member-detail-index'
        useNav={_useNav}
        useMenuBtns={_useNav}
      >
        <View className='van-page-box'>
          <Cell>{avatar ? <Avatar size='mini' src={avatar}></Avatar> : <Avatar className='avatar'>{name ? name.substring(0, 1) : ''}</Avatar>}</Cell>
          <Cell title='姓名'>{name}</Cell>
          <Cell title='加入时间'>{dayjs(joinDate).format('YYYY-MM-DD HH:mm:ss')}</Cell>
        </View>
        <View className='van-page-button'>
          {memberId === userInfo?.id && (
            <Button block type='danger' onClick={quitGroup}>
              退出
            </Button>
          )}
        </View>
        <Dialog id='addressgroupmemberdetailDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
