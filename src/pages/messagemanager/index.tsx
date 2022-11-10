/*
 * @Author: Derek Xu
 * @Date: 2022-11-10 18:25:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 18:32:30
 * @FilePath: \xut-calendar-vant-weapp\src\pages\messagemanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Container from '@/components/container'
import './index.less'
import Unite from '@antmjs/unite'

export default Unite(
  {
    state: {}
  },
  function ({ state, events, loading }) {
    return (
      <Container navTitle='消息中心' className='' enablePagePullDownRefresh={false}>
        <></>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
