/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-20 00:11:58
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmembers\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import { Cell, Unite, Checkbox, CheckboxGroup, CellGroup, Button, Empty, Search } from '@antmjs/vantui'
import Container from '@/components/container'
import { userInfoStore } from '@/store'
import Header from '@/components/header'
import { IUserInfo } from 'types/user'
import { useRecoilValue } from 'recoil'
import { useBack } from '@/utils/taro'
import Router from 'tarojs-router-next'
import { MemberBody } from './ui'
import './index.less'

export default Unite(
  {
    state: {
      allCheck: [],
      list: Array.from({ length: 20 }, (v, k) => k)
        .splice(1)
        .map((i) => {
          return i
        }),
      checkedIds: []
    },

    async onLoad() {
      const { members } = Router.getData()
      if (members.length === 0) return
      this.setState({
        checkedIds: members
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
    }
  },
  function ({ state, events }) {
    const { allCheck, list, checkedIds } = state
    const { setAllCheckClick, setCheck, saveMembers } = events
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)
    const [back] = useBack({
      to: 1
    })

    events.setHooks({
      back: back
    })

    return (
      <Container
        navTitle='事件邀请者'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-member-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='事件邀请者' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Search placeholder='请输入用户' renderAction={<View>添加</View>}></Search>
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
          <Button type='danger' block onClick={saveMembers}>
            删除
          </Button>
          <View className='block'></View>
          <Button type='info' block onClick={saveMembers}>
            保存
          </Button>
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
