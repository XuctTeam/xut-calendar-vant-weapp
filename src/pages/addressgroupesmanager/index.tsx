/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-09 18:36:51
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useEffect } from 'react'
import { Dialog, PowerScrollView } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import { useRecoilValue } from 'recoil'
import { GroupBody, GroupHeader } from './ui'
import { IGroup } from 'types/group'
import { groupList, deleteGroup } from '@/api/group'
import { cacheGetSync } from '@/cache'
import { IMenuButton, userInfoStore } from '@/store'
import { useToast } from 'taro-hooks'
import { IUserInfo } from 'types/user'
import { useNav } from '@/utils'
import { menuButtonStore } from '@/store'

import './index.less'

export default Unite(
  {
    state: {
      list: [],
      loading: false
    },

    async query(data?: any) {
      console.log(data)
      if (!this.hooks['accessToken']) {
        this.setState({
          list: [],
          loading: false
        })
        return
      }
      this.setState({
        loading: true
      })
      let res
      try {
        res = await groupList()
      } catch (err) {
        console.log(err)
        this.setState({
          loading: false
        })
      }
      if (!res) return
      const list = res as any as IGroup[]
      const _list = [...list]
      this.setState({
        loading: false,
        list: _list
      })
    },

    async addGroup() {
      try {
        const res: any = Router.toAddressgroupesedit({
          params: {}
        })
        if (!res) return
        const { edit } = res
        if (!!edit) {
          this.query()
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
          this.query()
        }
      } catch (err: any) {
        console.log(err)
      }
    },

    deleteGroup(id: string) {
      Dialog.confirm({
        title: '提示',
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
        this.query()
      })
    }
  },
  function ({ state, events }) {
    const { list, loading } = state
    const { addGroup, editGroup, deleteGroup, query } = events
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const menuButton: IMenuButton | undefined = useRecoilValue(menuButtonStore)
    const accessToken = cacheGetSync('accessToken')
    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: toast,
      accessToken: accessToken,
      menuButton: menuButton
    })

    useEffect(() => {
      query()
    }, [accessToken])

    return (
      <Container navTitle='通讯录管理' enablePagePullDownRefresh={false} useNav={useNav()} useMenuBtns={false} className='pages-address-groupes-manager-index'>
        <View className='header'>
          <GroupHeader addGroup={addGroup}></GroupHeader>
        </View>
        <View className='list'>
          <PowerScrollView
            finishedText='没有更多了'
            emptyDescription='~空空如也~'
            current={list.length}
            refresherEnabled
            scrollY
            onScrollToUpper={query}
            finished={!loading}
            className='scroll'
          >
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
          </PowerScrollView>
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
