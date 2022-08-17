/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 17:51:11
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditdescription\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Button, Unite } from '@antmjs/vantui'
import { Textarea, View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import './index.less'
import { useBack } from '@/utils/taro'

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
    const [back] = useBack({
      to: 1
    })

    events.setHooks({
      back: back
    })

    return (
      <Container
        navTitle='描述信息'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-desc-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='描述信息' left={true} to={1}></Header>
        }}
      >
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
