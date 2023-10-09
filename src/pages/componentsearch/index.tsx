/*
 * @Author: Derek Xu
 * @Date: 2022-11-14 14:02:34
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-06-13 11:28:38
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentsearch\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import Unite from '@antmjs/unite'
import { Search } from '@antmjs/vantui'
import { useRef } from 'react'
import { useToast } from 'taro-hooks'
import { View } from '@tarojs/components'
import './index.less'
import dayjs from 'dayjs'
import * as Router from 'tarojs-router-next'
import Container from '@/components/container'
import { search } from '@/calendar/api/modules/component'
import { useNav } from '@/calendar/utils'
import { ICalendarComponent, ICalendarPageComponent, IDavComponent } from 'types/calendar'
import { DayBody } from './ui'

export default Unite(
  {
    state: {
      searchValue: '',
      finished: true,
      components: []
    },

    setSearchValue(searchValue: string) {
      this.setState({
        searchValue
      })
    },

    searched() {
      console.log(this.state.searchValue)
      if (!this.state.searchValue) {
        this.hooks['toast']({
          title: '请输入搜索内容'
        })
        return
      }
      this.hooks['pageRef'].current = 0
      this.setState({
        components: []
      })
      this.query()
    },

    async query() {
      const self = this
      search(this.state.searchValue, this.hooks['pageRef'].current, 20).then((res) => {
        const searchData: ICalendarPageComponent = res as any as ICalendarPageComponent
        const { finished, components } = searchData
        self._fillComponentList(finished, components)
      })
    },

    async viewComponent(id: string) {
      let res
      try {
        res = await Router.toComponentview({
          params: {
            id,
            form: '3'
          }
        })
      } catch (err) {
        console.log(err)
      }
      if (!res) return
      const { isRemove } = res
      if (!isRemove) return
      this.searched()
    },
    /**
     * @description 填充展示数据
     * @param components
     */
    _fillComponentList(findished: boolean, components: Array<IDavComponent>) {
      const days: Array<string> = this.state.components.map((i) => {
        return i.day
      })
      const componentList: Array<ICalendarComponent> = [...this.state.components]
      components.forEach((comp) => {
        const formatDay = dayjs(comp.dtstart).format('YYYY-MM-DD')
        if (days.includes(formatDay)) {
          componentList.find((i) => i.day === formatDay)?.components.push(comp)
        } else {
          days.push(formatDay)
          componentList.push({
            day: formatDay,
            calendarId: comp.calendarId,
            components: [comp]
          })
        }
      })
      this.setState({
        components: componentList,
        finished: findished
      })
      this.hooks['pageRef'].current += 1
    }
  },
  function ({ state, events }) {
    const { components, finished } = state
    const { setSearchValue, searched, viewComponent, query } = events
    const usedNav = useNav()
    const pageRef = useRef<number>(0)
    const [toast] = useToast({
      icon: 'error'
    })
    events.setHooks({
      pageRef: pageRef,
      toast: toast
    })

    return (
      <Container navTitle='日程搜索' enablePagePullDownRefresh={false} className='pages-component-search-index' useNav={usedNav} useMenuBtns={usedNav}>
        <Search placeholder='请输入搜索关键词' onChange={(e) => setSearchValue(e.detail)} renderAction={<View onClick={searched}>搜索</View>} />
        <PowerScrollView
          finishedText='没有更多了'
          successText='刷新成功'
          emptyDescription='空空如也~'
          style={{ height: '100%' }}
          onScrollToLower={query}
          current={components.length}
          refresherEnabled={false}
          finished={finished}
        >
          {components.map((item, i) => (
            <DayBody key={i} day={item.day} viewComponent={viewComponent} components={item.components}></DayBody>
          ))}
        </PowerScrollView>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
