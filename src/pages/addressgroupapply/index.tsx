/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 21:25:13
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { ITouchEvent, View } from '@tarojs/components'
import { Search, Unite, Sidebar, SidebarItem, Loading, Empty, Tabs, Tab } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import Router from 'tarojs-router-next'
import { IGroupMember } from 'types/group'
import { applyMineList, mineApplyList } from '@/api/groupmember'
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
    }
  },
  function ({ state, events }) {
    const { loading, list } = state
    const { setActive, onSearchFouce } = events
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
            <MemberList loading={loading} list={list}></MemberList>
          </Tab>
          <Tab title='我的申请'>
            <MemberList loading={loading} list={list}></MemberList>
          </Tab>
        </Tabs>

        {/* <Sidebar
            activeKey={sidebarActive}
            onChange={(e) => {
              if (loading) {
              }
              setSidebarActive(e.detail || 0)
            }}
          >
            <SidebarItem title='申请我的' />
            <SidebarItem title='我的申请' />
          </Sidebar>
          <View className='group-apply'>
            {loading ? (
              <View className='loading'>
                <Loading size='24px'>加载中...</Loading>
              </View>
            ) : (
              <View className='body'>
                <View className='header'>{sidebarActive === 0 ? '申请我的' : '我的申请'}</View>
                {list.length === 0 ? <Empty description='暂无数据' /> : <MemberList></MemberList>}
              </View>
            )}
          </View> */}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})