/*
 * @Author: Derek Xu
 * @Date: 2022-10-05 21:08:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-19 15:38:14
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentattend\index.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Col, Empty, Loading, Row } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import calendar from '@/calendar'
import { TMember } from 'types/group'
import { MemberBody } from './ui'
import './index.less'

interface IAttendStatistics {
  attendSum: number
  accepted: number
  noOperation: number
}

export default Unite(
  {
    state: {
      loading: true,
      nums: 0,
      accepted: 0,
      no_accepted: 0,
      no_operation: 0,
      list: []
    },

    async onLoad() {
      const { id } = this.location.params
      if (!id) return
      this.setState({
        loading: true
      })

      const result = await Promise.all([calendar.$api.component.queryComponentMembers('', id), calendar.$api.component.attendStatistics(id)])
      if (!(result && result.length === 2)) return
      const statistics = result[1] as any as IAttendStatistics
      this.setState({
        loading: false,
        list: result[0] as any as TMember[],
        nums: statistics.attendSum,
        accepted: statistics.accepted,
        no_operation: statistics.noOperation,
        no_accepted: statistics.attendSum - (statistics.accepted + statistics.noOperation)
      })
    }
  },
  function ({ state }) {
    const { loading, nums, accepted, no_accepted, no_operation, list } = state
    const usedNav = calendar.$hooks.useNav()

    return (
      <Container navTitle='日程邀请人' enablePagePullDownRefresh={false} className='pages-component-attend-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='statistics'>
          <View className='li'>
            <View className='row'>
              <Row>
                <Col span='8' className='dark'>
                  <View>已接受</View>
                  <View>{accepted}</View>
                </Col>
                <Col span='8' className='light'>
                  <View>未接受</View>
                  <View>{no_accepted}</View>
                </Col>
                <Col span='8' className='dark'>
                  <View>未处理</View>
                  <View>{no_operation}</View>
                </Col>
              </Row>
            </View>
            <View className='count'>共邀请 {nums}人</View>
          </View>
        </View>
        <View className='li member-list'>
          {loading ? (
            <View className='loading'>
              <Loading>加载中...</Loading>
            </View>
          ) : (
            <>
              {list.length === 0 ? (
                <Empty description='~空空如也~'></Empty>
              ) : (
                <>
                  {list.map((item, index) => {
                    return <MemberBody key={index} name={item.name} avatar={item.avatar} memberId={item.memberId}></MemberBody>
                  })}
                </>
              )}
            </>
          )}
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
