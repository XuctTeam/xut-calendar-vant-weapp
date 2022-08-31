/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-31 17:45:39
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmemberchoose\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Cell, CellGroup, CheckboxGroup, Unite, Checkbox, Empty, Loading } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import { ScrollView, View } from '@tarojs/components'
import { GroupSelect } from './ui'
import { IGroup } from 'types/group'
import { groupList } from '@/api/group'
import { groupMemberList } from '@/api/groupmember'
import './index.less'

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
            groups: res as any as IGroup[]
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setAllCheckClick(allCheck: string[]) {
      this.setState({
        allCheck
      })
    },

    setGroupClick(id: string) {
      this.setState({
        loading: true
      })
      groupMemberList(id)
        .then((res) => {
          debugger
          this.setState({
            loading: true
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  },
  function ({ state, events }) {
    const { groups, allCheck, checkedIds, loading } = state
    const { setAllCheckClick, setGroupClick } = events

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
        <CheckboxGroup value={allCheck} onChange={(e) => setAllCheckClick(e.detail)}>
          <CellGroup>
            <Cell title={`全选【${checkedIds.length}】人`}>
              <Checkbox name='1' shape='square'></Checkbox>
            </Cell>
          </CellGroup>
          <></>
        </CheckboxGroup>
        <View className='list'>
          {loading ? <Loading type='spinner'>加载中...</Loading> : checkedIds.length === 0 ? <Empty description='~空空如也~'></Empty> : <></>}
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
