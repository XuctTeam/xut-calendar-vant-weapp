/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-18 22:41:07
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmembers\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import { Cell, Unite, Checkbox, CheckboxGroup, CellGroup, Button } from '@antmjs/vantui'
import Container from '@/components/container'
import { userInfoStore } from '@/store'
import Header from '@/components/header'

import { IUserInfo } from 'types/user'
import { useRecoilValue } from 'recoil'
import './index.less'

export default Unite(
  {
    state: {
      allCheck: [],
      list: []
    }
  },
  function ({ state, events, loading }) {
    const { allCheck, list } = state
    const userInfoState: IUserInfo | undefined = useRecoilValue(userInfoStore)

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
          <CheckboxGroup value={allCheck}>
            <CellGroup>
              <Cell title='全选'>
                <Checkbox name='1'></Checkbox>
              </Cell>
            </CellGroup>
            <></>
          </CheckboxGroup>
          <Cell>sdfsdf</Cell>
          <View className='divider'></View>
          <CheckboxGroup>
            <CellGroup>
              {list.map((item, index) => {
                return (
                  <Cell key={index}>
                    sdfsfsdfsdf
                    <Checkbox name='1'>全选</Checkbox>
                  </Cell>
                )
              })}
            </CellGroup>
            <></>
          </CheckboxGroup>
        </View>
        <View className='van-page-button'>
          <Button type='info' block>
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
