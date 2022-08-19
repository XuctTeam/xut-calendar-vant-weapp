/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-19 21:18:59
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import { useEffect } from 'react'
import { Dialog, Empty, Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import { useRecoilValue } from 'recoil'
import Header from '@/components/header'
import { GroupBody, GroupHeader } from './ui'
import { IGroup } from 'types/group'
import { groupList, deleteGroup } from '@/api/group'
import { cacheGetSync } from '@/cache'
import { userInfoStore } from '@/store'
import { useToast } from 'taro-hooks'
import { IUserInfo } from 'types/user'

import './index.less'

export default Unite(
  {
    state: {
      list: [],
      loading: false
    },

    async onLoad() {},

    init() {
      if (!cacheGetSync('accessToken')) {
        this.setState({
          list: []
        })
        return
      }
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
        const res: any = Router.toAddressgroupesedit()
        if (!res) return
        const { edit } = res
        if (!!edit) {
          this.init()
        }
      } catch (err) {
        console.log(err)
      }
    },

    async editGroup(id: string) {
      console.log(id)
      try {
        const result = await Router.toAddressgroupesedit({
          params: {
            id
          }
        })
        if (!result) return
        const { edit } = result
        if (!!edit) {
          this.init()
        }
      } catch (err: any) {
        console.log(err)
      }
    },

    deleteGroup(id: string) {
      Dialog.confirm({
        title: '确认消息',
        message: '是否删除?',
        selector: 'vanGroupMememberDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this._deleteGroup(id)
      })
    },

    _deleteGroup(id: string) {
      this.setState({
        loading: true
      })
      deleteGroup(id)
        .then(() => {
          this._showDeleteToast()
        })
        .catch((err: any) => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
    },

    _showDeleteToast() {
      this.setState({
        loading: false
      })
      this.hooks['toast']({
        title: '删除成功'
      }).then(() => {
        this.init()
      })
    }
  },
  function ({ state, events }) {
    const { list, loading } = state
    const { addGroup, editGroup, deleteGroup, init } = events
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const accessToken = cacheGetSync('accessToken')
    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: toast
    })

    useEffect(() => {
      init()
    }, [accessToken])

    return (
      <Container
        navTitle='通讯录管理'
        enablePagePullDownRefresh={false}
        className='pages-address-groupes-manager-index '
        loading={loading}
        renderPageTopHeader={() => {
          return <Header title='通讯录管理' left={false} to={2}></Header>
        }}
      >
        <GroupHeader addGroup={addGroup}></GroupHeader>
        <View className='list'>
          {list && list.length > 0 ? (
            <>
              {list.map((item: IGroup, index: number) => (
                <GroupBody
                  key={index}
                  group={item}
                  uid={userInfoState?.id || ''}
                  remove={deleteGroup}
                  edit={editGroup}
                  members={(id: string) => {
                    Router.toAddressgroupmember({
                      params: {
                        id
                      }
                    })
                  }}
                ></GroupBody>
              ))}
            </>
          ) : (
            <Empty description='~空空如也~' />
          )}
        </View>

        <Dialog id='vanGroupMememberDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
