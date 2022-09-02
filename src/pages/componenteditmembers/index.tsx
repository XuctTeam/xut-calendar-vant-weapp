/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-01 10:47:45
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmembers\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import { Cell, Unite, Checkbox, CheckboxGroup, CellGroup, Button, Empty, Search, Dialog } from '@antmjs/vantui'
import Container from '@/components/container'
import { userInfoStore } from '@/store'
import Header from '@/components/header'
import { IUserInfo } from 'types/user'
import { useRecoilValue } from 'recoil'
import { useBack } from '@/utils/taro'
import Router from 'tarojs-router-next'
import { MemberBody } from './ui'
import { useToast } from 'taro-hooks'
import { queryByIds } from '@/api/groupmember'
import './index.less'
import { IGroupMember } from 'types/group'

export default Unite(
  {
    state: {
      loading: false,
      allCheck: [],
      list: [],
      checkedIds: []
    },

    async onLoad() {
      const data = Router.getData()
      if (!data) return
      const { members } = data
      if (!(members && members.length > 0)) return

      this.setState({
        checkedIds: members
      })
    },

    _init(members: string[]) {
      this.setState({
        loading: true
      })
      queryByIds(members)
        .then((res) => {
          this.setState({
            loading: false,
            list: res as any as IGroupMember[]
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
          checkedIds: this.state.list.map((item) => item.toString()),
          allCheck: values
        })
        return
      }
      this.setState({
        checkedIds: [],
        allCheck: values
      })
    },

    setCheck(values: string[]) {
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
          checkedIds: this.state.list.map((item) => item.toString())
        })
        return
      }
      this.setState({
        allCheck: [],
        checkedIds: this.state.list.filter((item) => values.includes(item.toString())).map((item) => item.toString())
      })
    },

    saveMembers() {
      this.hooks['back']({
        data: {
          members: this.state.checkedIds.map((item) => item.toString())
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
        title: '确认',
        message: '确认消息吗？',
        selector: 'componentEditMemberDialog'
      }).then((value) => {
        if (value === 'cancel') return
        const _keeps = this.state.list.filter((item) => !this.state.checkedIds.includes(item.toString()))
        this.setState({
          list: _keeps,
          checkedIds: []
        })
      })
    },

    onSearch(val: string) {
      console.log(val)
    },

    async onChooseMember() {
      try {
        const result = await Router.toComponenteditmemberchoose()
        if (!result) return
        const { memberIds } = result
        if (!memberIds) return
      } catch (err) {
        console.log(err)
      }
    }
  },
  function ({ state, events }) {
    const { loading, allCheck, list, checkedIds } = state
    const { setAllCheckClick, setCheck, saveMembers, removeMember, onSearch, onChooseMember } = events
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const [back] = useBack({
      to: 1
    })
    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      back: back,
      toast: toast
    })

    return (
      <Container
        navTitle='事件邀请者'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-member-index'
        h5Nav={true}
        useNav={true}
        loading={loading}
        renderPageTopHeader={() => {
          return <Header title='事件邀请者' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Search
            placeholder='请输入用户'
            renderAction={
              <View
                onClick={(e) => {
                  e.stopPropagation()
                  onChooseMember()
                }}
              >
                按组查询
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
          <MemberBody name={userInfoState?.name || ''} avatar={userInfoState?.avatar || ''}></MemberBody>
          <View className='divider'></View>
          {list.length === 0 ? (
            <Empty description='~空空如也~'></Empty>
          ) : (
            <View className='list'>
              <CheckboxGroup value={checkedIds} onChange={(e) => setCheck(e.detail)}>
                <CellGroup>
                  {list.map((item, index) => {
                    return (
                      <Cell key={index}>
                        <View className='member'>
                          {item}
                          <Checkbox name={`${item}`} shape='square' />
                        </View>
                      </Cell>
                    )
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
