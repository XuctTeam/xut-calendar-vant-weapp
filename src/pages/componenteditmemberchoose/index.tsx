/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-22 17:55:16
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmemberchoose\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Cell, CellGroup, CheckboxGroup, Checkbox, Empty, Loading, Button } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import { ScrollView, View } from '@tarojs/components'
import { GroupSelect } from './ui'
import { IGroup, IGroupMember } from 'types/group'
import { groupList } from '@/api/group'
import { groupMemberList } from '@/api/groupmember'
import './index.less'
import { useBack } from '@/utils/taro'

export default Unite(
  {
    state: {
      loading: false,
      allCheck: [],
      groups: [],
      members: [],
      checkedIds: []
    },

    async onLoad() {
      groupList()
        .then((res) => {
          this.setState({
            groups: (res as any as IGroup[]).filter((item) => item.count !== 1)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setAllCheckClick(allCheck: string[]) {
      if (allCheck.length === 0) {
        this.setState({
          allCheck,
          checkedIds: []
        })
        return
      }
      this.setState({
        allCheck,
        checkedIds: this.state.members.map((item) => item.memberId)
      })
    },

    setGroupClick(id: string) {
      if (!!this.state.loading) return
      this.setState({
        loading: true
      })
      groupMemberList(id)
        .then((res) => {
          this.setState({
            loading: false,
            members: res as any as IGroupMember[]
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    },

    setCheckSelected(values: string[]) {
      this.setState({
        checkedIds: values
      })
      this.setState({
        allCheck: values.length === this.state.members.length ? ['1'] : []
      })
    },

    saveSelectMember() {
      if (this.state.checkedIds.length === 0) {
        this.hooks['back']()
        return
      }
      const checkMembers = this.state.members.filter((item) => this.state.checkedIds.includes(item.memberId + ''))
      this.hooks['back']({
        data: {
          members: checkMembers
        }
      })
    }
  },
  function ({ state, events }) {
    const { groups, allCheck, checkedIds, loading, members } = state
    const { setAllCheckClick, setGroupClick, setCheckSelected, saveSelectMember } = events
    const [back] = useBack({
      to: 1
    })

    events.setHooks({
      back: back
    })

    return (
      <Container
        navTitle='参与人选择'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-member-choose-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='参与人选择' left={true} to={1}></Header>
        }}
      >
        <ScrollView className='scrollview' scrollX scrollWithAnimation>
          {groups.map((item: IGroup, index) => {
            return (
              <GroupSelect
                key={index}
                id={item.id || ''}
                name={item.name}
                images={item.images || ''}
                count={item.count || 0}
                onClick={setGroupClick}
              ></GroupSelect>
            )
          })}
        </ScrollView>
        <View className='divider'></View>
        <View className='list'>
          <CheckboxGroup value={allCheck} onChange={(e) => setAllCheckClick(e.detail)}>
            <CellGroup>
              <Cell title={`全选【${checkedIds.length}】人`} border={false}>
                <Checkbox name='1' shape='square'></Checkbox>
              </Cell>
            </CellGroup>
            <></>
          </CheckboxGroup>
          {loading ? (
            <View className='loading-box'>
              <Loading type='spinner'>加载中...</Loading>
            </View>
          ) : members.length === 0 ? (
            <Empty description='~空空如也~'></Empty>
          ) : (
            <CheckboxGroup value={checkedIds} onChange={(e) => setCheckSelected(e.detail)}>
              <CellGroup>
                {members.map((item, index: number) => {
                  return (
                    <Cell key={index} title={item.name}>
                      <Checkbox name={`${item.memberId}`} shape='square' />
                    </Cell>
                  )
                })}
              </CellGroup>
              <></>
            </CheckboxGroup>
          )}
        </View>
        <View className='buttons'>
          <Button type='info' block onClick={saveSelectMember}>
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
