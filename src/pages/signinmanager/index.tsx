/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 16:55:08
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-06-13 10:37:47
 * @FilePath: \xut-calendar-vant-weapp\src\pages\signinmanager\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Tab, Tabs } from '@antmjs/vantui'
import Container from '@/components/container'
import { useNav } from '@/calendar/utils'
import { Join, Mine } from './ui'
import './index.less'

export default Unite(
  {
    state: {
      minFinished: true,
      minSingList: []
    }
  },
  function ({ state, events }) {
    const { minFinished, minSingList } = state
    const usedNav = useNav()

    return (
      <Container navTitle='签到' enablePagePullDownRefresh={false} className='pages-signin-mamager-index' useNav={usedNav} useMenuBtns={usedNav}>
        <Tabs sticky={false}>
          <Tab title='我发起的'>
            <Mine finished={minFinished} signlist={minSingList} />
          </Tab>
          <Tab title='我参与的'>
            <Join />
          </Tab>
        </Tabs>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
