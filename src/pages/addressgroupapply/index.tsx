/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-14 21:58:25
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupapply\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Icon, Search, Tab, Tabs, Toast, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import './index.less'
import { View } from '@tarojs/components'

export default Unite(
  {
    state: {
      value: ''
    },

    setValue(value: string) {
      this.setState({
        value
      })
    }
  },
  function ({ state, events, loading }) {
    const { value } = state
    const { setValue } = events
    return (
      <Container
        navTitle='群组申请'
        enablePagePullDownRefresh={false}
        h5Nav={true}
        className='address-group-apply-index'
        renderPageTopHeader={() => {
          return <Header title='群组申请' left to={2}></Header>
        }}
      >
        <Search onChange={(e) => setValue(e.detail)} placeholder='请输入组名称' showAction onSearch={() => {}} onCancel={() => {}} />
        <View className='plus'>
          <Icon classPrefix='page-icon' name='daishenhe' size='32px'></Icon>
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
