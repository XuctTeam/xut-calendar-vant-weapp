/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 11:22:05
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmember\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Empty, IndexAnchor, IndexBar } from '@antmjs/vantui'
import { Block } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import { IndexList } from '@/calendar/constants'
import calendar from '@/calendar'
import { IPinYinGroupMember } from 'types/group'
import { MemberList } from './ui'
import './index.less'

export default Unite(
  {
    state: { id: '', list: [], loading: false },
    async onLoad() {
      const { id } = this.location.params
      if (!!id) {
        this._init(id)
      }
    },

    _init(id: string) {
      this.setState({
        loading: true,
        id: id,
        list: []
      })
      calendar.$api.groupMember
        .groupMemberPinYinList(id)
        .then((res) => {
          this.setState({
            list: res as any as IPinYinGroupMember[],
            loading: false
          })
        })
        .catch((err: any) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    async selected(groupId: string, memberId: string) {
      let res
      try {
        res = await Router.toAddressgroupmemberdetail({
          params: {
            groupId,
            memberId
          }
        })
      } catch (err) {
        console.log(err)
      }
      if (!res) return
      const { refresh } = res
      if (!refresh) return
      this._init(this.state.id)
    }
  },
  function ({ state, events }) {
    const { list, loading } = state
    const { selected } = events
    const indexList = IndexList()
    const usedNav = calendar.$hooks.useNav()
    return (
      <Container
        navTitle='群组会员'
        enablePagePullDownRefresh={false}
        className='pages-address-groupes-member-index'
        useNav={usedNav}
        useMenuBtns={usedNav}
        loading={loading}
      >
        {list.length === 0 ? (
          <Empty description='空空如也~'></Empty>
        ) : (
          <IndexBar indexList={indexList}>
            {list.map((item: IPinYinGroupMember, index: number) => (
              <Block key={index}>
                <IndexAnchor index={item.charCode}></IndexAnchor>
                <MemberList charCode={item.charCode} members={item.members} selected={selected}></MemberList>
              </Block>
            ))}
          </IndexBar>
        )}
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
