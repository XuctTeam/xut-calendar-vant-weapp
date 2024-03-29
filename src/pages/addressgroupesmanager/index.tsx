/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 11:22:59
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Dialog } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { Router } from 'tarojs-router-next'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useToast } from 'taro-hooks'
import dayjs from 'dayjs'
import Taro from '@tarojs/taro'

import { cacheGetSync } from '@/calendar/cache/cache'
import { groupRefreshTimeStore, IMenuButton, userInfoStore, menuButtonStore } from '@/calendar/store/store'
import Container from '@/components/container'
import calendar from '@/calendar'
import { IUserInfo } from 'types/user'
import { IGroup } from 'types/group'

import { GroupBody, GroupHeader } from './ui'
import './index.less'

export default Unite(
  {
    state: {
      list: [],
      loading: false,
      refreshTime: 0
    },

    async onLoad() {
      Taro.eventCenter.on('logout', () => {
        this.clean()
      })
    },

    async query() {
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
        res = await calendar.$api.group.groupList()
      } catch (err) {
        console.log(err)
        this.setState({
          loading: false
        })
      }
      if (!res) return
      const refreshDate = dayjs().valueOf()
      const list = res as any as IGroup[]
      const _list = [...list]
      this.setState({
        loading: false,
        list: _list,
        refreshTime: refreshDate
      })
      this.hooks['setGroupRefreshTimeStore'](refreshDate)
    },

    async onShow() {
      if (this.hooks['groupRefreshState'] > this.state.refreshTime || this.state.refreshTime === 0) {
        this.query()
      }
    },

    clean() {
      if (this.hooks['accessToken']) return
      this.setState({
        list: [],
        loading: false,
        refreshTime: 0
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
        selector: 'vanGroupMemberDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this._deleteGroup(id)
      })
    },

    _deleteGroup(id: string) {
      this.setState({
        loading: true
      })
      calendar.$api.group
        .deleteGroup(id)
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
    const [groupRefreshState, setGroupRefreshTimeStore] = useRecoilState(groupRefreshTimeStore)
    const accessToken = cacheGetSync('accessToken')
    const { show } = useToast({
      icon: 'error'
    })

    events.setHooks({
      toast: show,
      accessToken: accessToken,
      menuButton: menuButton,
      groupRefreshState: groupRefreshState,
      setGroupRefreshTimeStore: setGroupRefreshTimeStore
    })

    return (
      <Container navTitle='通讯录管理' enablePagePullDownRefresh={false} useNav={useNav()} useMenuBtns={false} className='pages-address-groupes-manager-index'>
        <View className='header'>
          <GroupHeader addGroup={addGroup}></GroupHeader>
        </View>
        <View className='list'>
          {/* <PowerScrollView
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
          </PowerScrollView> */}
        </View>
        <Dialog id='vanGroupMemberDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
