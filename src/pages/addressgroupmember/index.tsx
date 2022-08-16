/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 22:46:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupmember\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Cell, IndexAnchor, IndexBar, Unite } from '@antmjs/vantui'
import { Block, View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import { groupMemberPinYinList } from '@/api/groupmember'
import { IPinYinGroupMember } from 'types/group'
import { IndexList } from '@/constants'
import { MemberList } from './ui'
import './index.less'

export default Unite(
  {
    state: { list: [], loading: false },
    async onLoad() {
      const { id } = this.location.params
      if (!!id) {
        this._init(id)
      }
    },

    _init(id: string) {
      this.setState({
        loading: true
      })
      groupMemberPinYinList(id)
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
    }
  },
  function ({ state }) {
    const { list, loading } = state

    return (
      <Container
        navTitle='群组会员'
        enablePagePullDownRefresh={false}
        className='pages-address-groupes-member-index'
        loading={loading}
        useNav={false}
        renderPageTopHeader={() => {
          return <Header title='群组会员' left={true} to={2}></Header>
        }}
      >
        <IndexBar indexList={IndexList()}>
          {list.map((item: IPinYinGroupMember, index: number) => (
            <Block key={index}>
              <IndexAnchor index={item.charCode}></IndexAnchor>
              <MemberList charCode={item.charCode} members={item.members}></MemberList>
            </Block>
          ))}
        </IndexBar>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
