/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:45:05
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/unite'
import { View } from '@tarojs/components'
import { Search, Tabs, Tab, Dialog } from '@antmjs/vantui'
import { Router } from 'tarojs-router-next'
import { useSetRecoilState } from 'recoil'
import dayjs from 'dayjs'
import Container from '@/components/container'
import calendar from '@/calendar'
import { IGroupMember } from 'types/group'
import { MemberList } from './ui'
import './index.less'

export default Unite(
  {
    state: {
      active: 0,
      loading: true,
      list: []
    },

    async onLoad() {
      this._applyMine()
    },

    setActive(active: number) {
      if (this.state.loading) {
        this.setState({
          loading: false
        })
      }
      this.setState({
        active: active,
        loading: true
      })
      if (active === 0) {
        this._applyMine()
        return
      }
      this._mineApply()
      return
    },

    async onSearchFouce() {
      const active = this.state.active
      try {
        const result = await Router.toAddressgroupsearch()
        if (!result) return
        const { refresh } = result
        if (!!refresh) return
        if (active === 1) {
          this._mineApply()
        }
      } catch (err: any) {
        console.log(err)
      }
    },

    _applyMine() {
      calendar.$api.groupMember
        .applyMineList()
        .then((res) => {
          this.setState({
            list: res as any as Array<IGroupMember>,
            loading: false
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    _mineApply() {
      calendar.$api.groupMember
        .mineApplyList()
        .then((res) => {
          this.setState({
            list: res as any as Array<IGroupMember>,
            loading: false
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    /**
     * 同意申请
     * @param gid
     * @param mid
     */
    agreeJoin(gmid: string) {
      Dialog.confirm({
        title: '提示',
        message: '确认同意申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        calendar.$api.groupMember
          .applyAgreeJoinGroup(gmid, 1)
          .then(() => {
            if (this.state.active === 0) {
              this.hooks['setGroupRefreshTimeStore'](dayjs().valueOf())
              this._applyMine()
              return
            }
          })
          .catch((err: any) => {
            console.log(err)
          })
      })
    },

    /**
     * 拒绝申请
     * @param gid
     * @param mid
     */
    refuseJoin(gmid: string) {
      Dialog.confirm({
        title: '提示',
        message: '确认拒绝申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        calendar.$api.groupMember
          .applyRefuseJoinGroup(gmid, 2)
          .then(() => {
            if (this.state.active === 0) {
              this._applyMine()
              return
            }
          })
          .catch((err: any) => {
            console.log(err)
          })
      })
    },

    /**
     * 删除申请
     * @param gid
     */
    deleteApply(gmid: string) {
      Dialog.confirm({
        title: '提示',
        message: '确认撤回申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        calendar.$api.groupMember
          .applyRefuseJoinGroup(gmid, 3)
          .then(() => {
            if (this.state.active === 1) {
              this._mineApply()
              return
            }
          })
          .catch((err: any) => {
            console.log(err)
          })
      })
    }
  },
  function ({ state, events }) {
    const { active, loading, list } = state
    const { setActive, onSearchFouce, agreeJoin, refuseJoin, deleteApply } = events
    const usedNav = calendar.$hooks.useNav()
    const setGroupRefreshTimeStore = useSetRecoilState(calendar.$store.groupRefreshTimeStore)
    events.setHooks({
      setGroupRefreshTimeStore: setGroupRefreshTimeStore
    })

    return (
      <Container navTitle='群组申请' enablePagePullDownRefresh={false} className='address-group-apply-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='search'>
          <Search placeholder='搜索加入群组' shape='round' disabled onClickInput={onSearchFouce} />
        </View>
        <View className='box'>
          <Tabs swipeable onClick={(e) => setActive(e.detail.index)}>
            <Tab title='申请我的'>
              <MemberList active={active} loading={loading} list={list} agreeJoin={agreeJoin} refuseJoin={refuseJoin} deleteApply={deleteApply}></MemberList>
            </Tab>
            <Tab title='我的申请'>
              <MemberList active={active} loading={loading} list={list} agreeJoin={agreeJoin} refuseJoin={refuseJoin} deleteApply={deleteApply}></MemberList>
            </Tab>
          </Tabs>
        </View>

        <Dialog id='vanDialogGroupApply' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
