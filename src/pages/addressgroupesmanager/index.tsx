/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-11 19:12:03
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Empty, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import Header from '@/components/header'
import { GroupBody, GroupHeader } from './ui'
import { IGroup } from 'types/group'
import { groupList, deleteGroup } from '@/api/group'
import { cacheGetSync } from '@/cache'
import { userInfoStore } from '@/store'

import './index.less'
import { useRecoilValue } from 'recoil'

export default Unite(
  {
    state: {
      list: [],
      loading: false
    },

    async onLoad() {
      if (!cacheGetSync('accessToken')) return
      this._init()
    },

    _init() {
      this.setState({
        loading: true
      })
      groupList()
        .then((res) => {
          this.setState({
            loading: false,
            list: res as any as IGroup[]
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    async addGroup() {
      try {
        const result = await Router.toAddressgroupesedit()
        const { edit } = result
        if (!!edit) {
          this._init()
        }
      } catch (err: any) {
        console.log(err)
      }
    },

    async editGroup(id: string) {
      console.log(222222222222222)
      console.log(id)
      try {
        const result = await Router.toAddressgroupesedit({
          params: {
            id: id + ''
          }
        })
        const { edit } = result
        if (!!edit) {
          this._init()
        }
      } catch (err: any) {
        console.log(err)
      }
    }
  },
  function ({ state, events }) {
    const { list, loading } = state
    const { addGroup, editGroup } = events
    const userInfoState = useRecoilValue(userInfoStore)

    return (
      <Container
        navTitle='通讯录管理'
        enablePagePullDownRefresh={false}
        className='pages-address-groupes-manager-index '
        loading={loading}
        renderPageTopHeader={() => {
          return <Header title='通讯录管理' left to={4}></Header>
        }}
      >
        <GroupHeader addGroup={addGroup} mineClick={() => {}}></GroupHeader>
        <View className='br'></View>
        <>
          {list && list.length > 0 ? (
            <View className='list'>
              {list.map((item: IGroup, index: number) => (
                <GroupBody key={index} group={item} uid={userInfoState?.id || ''} remove={() => {}} edit={editGroup} viewGroup={() => {}}></GroupBody>
              ))}
            </View>
          ) : (
            <Empty description='暂无数据' />
          )}
        </>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
