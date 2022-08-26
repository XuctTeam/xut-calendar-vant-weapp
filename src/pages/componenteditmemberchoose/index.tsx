/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-22 19:49:44
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditmemberchoose\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/vantui'
import Container from '@/components/container'
import Header from '@/components/header'
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
        navTitle='参与人选择'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-location-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='参与人选择' left={true} to={1}></Header>
        }}
      >
        水电费水电费
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
