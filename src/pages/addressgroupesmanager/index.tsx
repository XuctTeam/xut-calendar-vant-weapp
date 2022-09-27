/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-28 02:14:52
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { useEffect } from 'react'
import { Dialog, Empty, Loading, PowerScrollView } from '@antmjs/vantui'
import { ScrollView, View } from '@tarojs/components'
import Router from 'tarojs-router-next'
import Container from '@/components/container'
import { useRecoilValue } from 'recoil'
import Header from '@/components/header'
import { GroupBody, GroupHeader } from './ui'
import { IGroup } from 'types/group'
import { groupList, deleteGroup } from '@/api/group'
import { cacheGetSync } from '@/cache'
import { IMenuButton, userInfoStore } from '@/store'
import { useToast } from 'taro-hooks'
import { IUserInfo } from 'types/user'
import classnames from 'classnames'
import { brower } from '@/utils'
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
        loading: true,
        list: []
      })
      groupList()
        .then((res) => {
          const list = res as any as IGroup[]
          const _list = [...list, ...list, ...list, ...list]
          this.setState({
            loading: false,
            list: _list
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
        title: '确认消息',
        message: '是否删除?',
        selector: 'vanGroupMememberDialog'
      }).then((value) => {
        if (value === 'cancel') return
        this._deleteGroup(id)
      })
    },

    getTopSize() {
      if (process.env.TARO_ENV === 'weapp') {
        const menuButton = this.hooks['menuButton']
        if (!menuButton) return 100
        return menuButton!.top + menuButton!.height + (menuButton!.top - menuButton!.statusBarHeight)
      }
      if (brower()) return 100
      return 200
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
    const { addGroup, editGroup, deleteGroup, query, getTopSize } = events
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
      <Container
        navTitle='通讯录管理'
        enablePagePullDownRefresh={false}
        className='pages-address-groupes-manager-index'
        tabbar
        renderPageTopHeader={() => {
          return <Header title='通讯录管理' left={false} to={2}></Header>
        }}
      >
        <View className='page-box' style={{ paddingTop: getTopSize() + 'px' }}>
          <View className='header'>
            <GroupHeader addGroup={addGroup}></GroupHeader>
          </View>
          <View className='divider'></View>
          <PowerScrollView
            className='list'
            finishedText='没有更多了'
            emptyDescription='~空空如也~'
            current={list.length}
            onScrollToUpper={query}
            finished={!loading}
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

            {/* {loading ? (
              <View className='loading'>
                <Loading>加载中...</Loading>
              </View>
            ) : (
              <>
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
              </>
            )} */}
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
