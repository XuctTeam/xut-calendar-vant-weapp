/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 22:52:46
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentedit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, CellGroup, Field, Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
import { View } from '@tarojs/components'
import './index.less'

export default Unite(
  {
    state: {
      list: null,
      complete: false
    }
  },
  function ({ state, events, loading }) {
    return (
      <Container
        navTitle='日程编辑'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='日程编辑' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <CellGroup inset>
            <Field label='姓名' required placeholder='请输入名称' border={false} onChange={(e) => setName(e.detail)} />
          </CellGroup>
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
