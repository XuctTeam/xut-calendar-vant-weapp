/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:34:19
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmembers\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/unite'
import { View } from '@tarojs/components'
import { useRef } from 'react'
import { Cell, Checkbox, CheckboxGroup, CellGroup, Button, Empty, Search, Dialog } from '@antmjs/vantui'
import { useRecoilValue } from 'recoil'
import { Router } from 'tarojs-router-next'
import { useToast } from 'taro-hooks'
import './index.less'
import { IGroupMember } from 'types/group'
import { userInfoStore } from '@/calendar/store/store'
import Container from '@/components/container'
import calendar from '@/calendar'
import { User } from '@/calendar/api/interface'
import { MySelf, MemberBody } from './ui'

export default Unite(
  {
    state: {
      loading: false,
      allCheck: undefined,
      list: [],
      checkedIds: []
    },

    async onLoad() {
      const data = Router.getData()
      if (!data) return
      const { members } = data
      if (!(members && members.length > 0)) return
      this._init(members)
    },

    _init(members: string[]) {
      this.setState({
        loading: true
      })
      calendar.$api.groupMember
        .queryByIds(members)
        .then((res) => {
          const _list = res.data
          this.hooks['listRef'].current = _list
          this.setState({
            loading: false,
            checkedIds: members,
            allCheck: ['1'],
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

    setAllCheckClick(values: string[]) {
      if (values.length !== 0) {
        this.setState({
          checkedIds: this.state.list.map((item) => item.memberId),
          allCheck: values
        })
        return
      }
      this.setState({
        checkedIds: [],
        allCheck: values
      })
    },

    setMemberCheck(values: string[]) {
      if (values.length === 0) {
        this.setState({
          allCheck: [],
          checkedIds: []
        })
        return
      }
      if (values.length === this.state.list.length) {
        this.setState({
          allCheck: ['1'],
          checkedIds: this.state.list.map((item) => item.memberId)
        })
        return
      }
      this.setState({
        allCheck: [],
        checkedIds: this.state.list.filter((item) => values.includes(item.memberId)).map((item) => item.toString())
      })
    },

    saveMembers() {
      if (this.state.checkedIds.length > 200) {
        this.hooks['toast']({
          title: '单事件最大200参会者'
        })
        return
      }

      this.hooks['back']({
        data: {
          members: this.state.checkedIds.map((item) => item)
        }
      })
    },

    removeMember() {
      if (this.state.checkedIds.length === 0) {
        this.hooks['toast']({
          title: '选择列表为空'
        })
        return
      }

      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？',
        selector: 'componentEditMemberDialog'
      }).then((value) => {
        if (value === 'cancel') return
        const _keeps = this.state.list.filter((item) => !this.state.checkedIds.includes(item.memberId))
        this.hooks['listRef'].current = _keeps
        this.setState({
          list: _keeps,
          checkedIds: []
        })
      })
    },

    onSearch(val: string) {
      if (!val) {
        this.setState({
          list: this.hooks['listRef'].current
        })
        return
      }
      const list = this.hooks['listRef'].current.filter((item) => item.name.indexOf(val) > 1)
      this.setState({
        list
      })
    },

    async onChooseMember() {
      try {
        const result = await Router.toComponenteditmemberchoose()
        if (!result) return
        const { members } = result
        if (!members) return
        const _members = [...members].filter((x: IGroupMember) => [...this.state.list].every((y: IGroupMember) => y.memberId !== x.memberId))
        if (!(_members && _members.length !== 0)) return
        const _list = [...this.state.list, ..._members]
        this.hooks['listRef'].current = _list
        this.setState({
          list: _list
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  function ({ state, events }) {
    const { loading, allCheck, checkedIds, list } = state
    const { setAllCheckClick, setMemberCheck: setMemberCheck, saveMembers, removeMember, onSearch, onChooseMember } = events
    const userInfoState: User.IUserInfo | undefined = useRecoilValue(userInfoStore)
    const listRef = useRef<IGroupMember[]>([])
    const [back] = calendar.$hooks.useBack({ to: 1 })
    const usedNav = calendar.$hooks.useNav()

    const { show } = useToast({
      icon: 'error'
    })

    events.setHooks({
      back: back,
      toast: show,
      listRef: listRef
    })

    return (
      <Container
        navTitle='事件邀请者'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-member-index'
        loading={loading}
        useNav={usedNav}
        useMenuBtns={usedNav}
      >
        <View className='van-page-box'>
          <Search
            placeholder='请输入用户'
            onClear={() => onSearch('')}
            renderAction={
              <View>
                <Button
                  size='small'
                  type='warning'
                  onClick={(e) => {
                    e.stopPropagation()
                    onChooseMember()
                  }}
                >
                  分组选择
                </Button>
              </View>
            }
            onSearch={(e) => onSearch(e.detail)}
          ></Search>
          <CheckboxGroup value={allCheck} onChange={(e) => setAllCheckClick(e.detail)}>
            <CellGroup>
              <Cell title={`全选【${checkedIds.length + 1}】人`}>
                <Checkbox name='1' shape='square'></Checkbox>
              </Cell>
            </CellGroup>
            <></>
          </CheckboxGroup>
          <MySelf name={userInfoState?.name || ''} avatar={userInfoState?.avatar || ''}></MySelf>
          <View className='divider'></View>
          {list.length === 0 ? (
            <Empty description='~空空如也~'></Empty>
          ) : (
            <View className='list'>
              <CheckboxGroup value={checkedIds} onChange={(e) => setMemberCheck(e.detail)}>
                <CellGroup>
                  {list.map((item, index) => {
                    return <MemberBody name={item.name} avatar={item.avatar} memberId={item.memberId} key={index}></MemberBody>
                  })}
                </CellGroup>
                <></>
              </CheckboxGroup>
            </View>
          )}
        </View>
        <View className='van-page-button'>
          <Button type='danger' block onClick={removeMember}>
            删除
          </Button>
          <View className='block'></View>
          <Button type='info' block onClick={saveMembers}>
            保存
          </Button>
        </View>
        <Dialog id='componentEditMemberDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
