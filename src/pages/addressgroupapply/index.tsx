/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 11:55:33
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { ITouchEvent } from '@tarojs/components'
import { Search, Unite, Tabs, Tab, Dialog } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import Router from 'tarojs-router-next'
import { IGroupMember } from 'types/group'
import { applyMineList, mineApplyList, applyAgreeJoinGroup, applyRefuseJoinGroup } from '@/api/groupmember'
import { MemberList } from './ui'

import './index.less'

export default Unite(
  {
    state: {
      active: 0,
      loading: false,
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

    async onSearchFouce(e: ITouchEvent) {
      e.stopPropagation()
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
      applyMineList()
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
      mineApplyList()
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
        title: '确认',
        message: '确认同意申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        applyAgreeJoinGroup(gmid, 1)
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
     * 拒绝申请
     * @param gid
     * @param mid
     */
    refuseJoin(gmid: string) {
      Dialog.confirm({
        title: '确认',
        message: '确认拒绝申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        applyRefuseJoinGroup(gmid, 2)
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
        title: '确认',
        message: '确认撤回申请吗？',
        selector: 'vanDialogGroupApply'
      }).then((value) => {
        if (value === 'cancel') return
        applyRefuseJoinGroup(gmid, 3)
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
    return (
      <Container
        navTitle='群组申请'
        enablePagePullDownRefresh={false}
        h5Nav={true}
        className='address-group-apply-index'
        renderPageTopHeader={() => {
          return <Header title='群组申请' left to={2}></Header>
        }}
      >
        <Search placeholder='搜索加入群组' shape='round' onFocus={onSearchFouce} />
        <Tabs swipeable className='box' onClick={(e) => setActive(e.detail.index)}>
          <Tab title='申请我的'>
            <MemberList active={active} loading={loading} list={list} agreeJoin={agreeJoin} refuseJoin={refuseJoin} deleteApply={deleteApply}></MemberList>
          </Tab>
          <Tab title='我的申请'>
            <MemberList active={active} loading={loading} list={list} agreeJoin={agreeJoin} refuseJoin={refuseJoin} deleteApply={deleteApply}></MemberList>
          </Tab>
        </Tabs>
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
