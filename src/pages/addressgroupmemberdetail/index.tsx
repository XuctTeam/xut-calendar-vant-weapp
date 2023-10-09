/*
 * @Author: Derek Xu
 * @Date: 2022-11-09 21:56:09
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:45:09
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmemberdetail\index.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import Unite from '@antmjs/unite'
import { Button, Cell, Dialog, Loading, Overlay, Tag } from '@antmjs/vantui'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Container from '@/components/container'
import { useNav } from '@/calendar/utils'
import { groupRefreshTimeStore, userInfoStore } from '@/calendar/store/store'
import Avatar from '@/components/avatar'
import './index.less'
import dayjs from 'dayjs'
import { getGroupMember, groupMemberLeave } from '@/calendar/api/modules/groupMember'
import { useBack } from '@/utils/taro'
import { IGroupMember } from 'types/group'

export default Unite(
  {
    state: {
      loading: true,
      saving: false,
      id: '',
      groupId: '',
      memberId: '',
      avatar: '',
      name: '',
      createTime: new Date(),
      groupCreateMemberName: '',
      groupName: '',
      groupCreateMemberId: ''
    },

    async onLoad() {
      const { groupId, memberId } = this.location.params
      if (!(groupId && memberId)) return
      this.setState({
        groupId,
        memberId
      })
      this._init(groupId, memberId)
    },

    _init(groupId: string, memberId: string) {
      getGroupMember(groupId, memberId)
        .then((res) => {
          this.setState({ ...(res as any as IGroupMember), loading: false })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    quitGroup(action: number) {
      const that = this
      Dialog.confirm({
        title: '提示',
        message: action === 4 ? '确认退出吗？' : '确认踢出用户吗？',
        selector: 'addressgroupmemberdetailDialog'
      }).then((value) => {
        if (value === 'cancel') return
        that._leaveGroup(action)
      })
    },

    _leaveGroup(action: number) {
      const that = this
      this.setState({
        saving: true
      })

      groupMemberLeave(this.state.groupId, action, this.state.memberId)
        .then(() => {
          this.hooks['setGroupRefreshTimeStore'](dayjs().valueOf())
          window.setTimeout(() => {
            this.setState({
              saving: false
            })
            if (action === 4) {
              that.hooks['back']({
                delta: 2
              })
              return
            }
            that.hooks['back']({
              data: {
                refresh: true
              }
            })
          }, 1500)
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            saving: false
          })
        })
    }
  },
  function ({ state, events }) {
    const { saving, loading, avatar, name, memberId, createTime, groupName, groupCreateMemberName, groupCreateMemberId } = state
    const { quitGroup } = events
    const _useNav = useNav()
    const userInfo = useRecoilValue(userInfoStore)
    const setGroupRefreshTimeStore = useSetRecoilState(groupRefreshTimeStore)
    const [back] = useBack()

    events.setHooks({
      userInfo: userInfo,
      back: back,
      setGroupRefreshTimeStore: setGroupRefreshTimeStore
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
          <Cell title='头像' className='avatar'>
            {avatar ? <Avatar size='medium' src={avatar}></Avatar> : <Avatar className='avatar-bg'>{name ? name.substring(0, 1) : ''}</Avatar>}
          </Cell>
          <Cell title='姓名'>{name}</Cell>
          <Cell title='加入时间'>{dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}</Cell>
          <Cell title='群组名称'>{groupName}</Cell>
          <Cell title='群主'>
            {groupCreateMemberId === userInfo?.id ? (
              <Tag type='danger' size='large'>
                {groupCreateMemberName}
              </Tag>
            ) : (
              groupCreateMemberName
            )}
          </Cell>
        </View>
        <View className='van-page-button'>
          {groupCreateMemberId !== userInfo?.id && memberId === userInfo?.id && (
            <Button
              block
              type='danger'
              onClick={() => {
                quitGroup(4)
              }}
            >
              退出
            </Button>
          )}
          {groupCreateMemberId === userInfo?.id && memberId !== userInfo?.id && (
            <Button
              block
              type='danger'
              onClick={() => {
                quitGroup(5)
              }}
            >
              请离
            </Button>
          )}
        </View>
        <Dialog id='addressgroupmemberdetailDialog' />
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
