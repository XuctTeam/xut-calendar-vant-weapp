/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-15 20:05:45
 * @FilePath: \xut-calendar-vant-weapp\src\pages\pagination\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Unite } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Container from '@/components/container'
import Pagination from '@/components/pagination'
import './index.less'

const PAGE_SIZE = 20

export default Unite(
  {
    state: {
      list: null,
      complete: false
    },
    async onLoad() {
      await this.loadList(true)
    },
    async loadList(refresh = false) {
      const list = await getRoleListCommon({
        pageSize: PAGE_SIZE,
        offset: refresh ? 0 : this.state.list.length
      })
      this.setState({
        list: refresh ? list : [].concat(this.state.list).concat(list as any),
        complete: list.length < PAGE_SIZE ? true : false
      })
    }
  },
  function ({ state, events, loading }) {
    const { list, complete } = state
    const { loadList } = events
    const [menuButton, setMenuButton]: any = useRecoilState(menuButtonStore)

    useReachBottom(() => {
      if (!loading.loadList && !complete) {
        loadList()
      }
    })
    return (
      <Container navTitle='下拉上滑列表页面' enablePagePullDownRefresh={true} loading={!list} className='pages-pagination-index'>
        <Pagination complete={complete} size={PAGE_SIZE} data={list}>
          {list?.map((item: any, index: number) => {
            return (
              <View className='li' key={index}>
                {item.name}
              </View>
            )
          })}
        </Pagination>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
