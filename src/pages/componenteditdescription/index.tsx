/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:42:04
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditdescription\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button } from '@antmjs/vantui'
import { Textarea, View } from '@tarojs/components'
import Container from '@/components/container'
import calendar from '@/calendar'
import './index.less'

export default Unite(
  {
    state: {
      description: ''
    },

    setDescription(description: string) {
      this.setState({
        description
      })
    },

    saveDescription() {
      this.hooks['back']({
        data: {
          description: this.state.description
        }
      })
    }
  },
  function ({ state, events }) {
    const { description } = state
    const { setDescription, saveDescription } = events
    const [back] = calendar.$hooks.useBack({ to: 1 })
    const usedNav = calendar.$hooks.useNav()

    events.setHooks({
      back: back
    })

    return (
      <Container navTitle='描述信息' enablePagePullDownRefresh={false} className='pages-component-edit-desc-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='van-page-box'>
          <Textarea
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
            placeholder='请输入地址'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          ></Textarea>
        </View>

        <View className='van-page-button'>
          <Button type='info' onClick={saveDescription}>
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
