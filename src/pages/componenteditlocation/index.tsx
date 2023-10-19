/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:41:22
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditlocation\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, Dialog } from '@antmjs/vantui'
import { Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useToast } from 'taro-hooks'
import Container from '@/components/container'
import calendar from '@/calendar'
import './index.less'

export default Unite(
  {
    state: {
      place: ''
    },

    setPlace(place: string) {
      this.setState({
        place
      })
    },

    chooseLocation() {
      const self = this
      Taro.chooseLocation({
        success(res) {
          self.setState({
            place: res.address
          })
        },
        fail: function (res) {
          console.log(res)
          if (process.env.TARO_ENV === 'weapp') {
            self._openSetting()
          }
        }
      }).catch((err) => {
        debugger
        console.log(err)
      })
    },

    saveLocation() {
      this.hooks['back']({
        data: {
          place: this.state.place
        }
      })
    },

    _openSetting() {
      const self = this
      Taro.getSetting({
        success: function (res) {
          const state = res.authSetting
          if (!state['scope.userLocation']) {
            Dialog.confirm({
              title: '提示',
              message: '需要获取您的地理位置',
              selector: 'locationDialog'
            }).then((value) => {
              if (value === 'cancel') return
              self._openSettingChoose()
            })
          }
        }
      })
    },

    _openSettingChoose() {
      const self = this
      Taro.openSetting({
        success: function (data) {
          if (data.authSetting['scope.userLocation'] === true) {
            Taro.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 1000
            })
            //授权成功之后，再调用chooseLocation选择地方
            Taro.chooseLocation({
              success: function (rs) {
                self.setState({
                  place: rs.address
                })
              }
            })
          } else {
            self.hooks['toast']('授权失败')
          }
        }
      })
    }
  },
  function ({ state, events }) {
    const { place } = state
    const { setPlace, chooseLocation, saveLocation } = events
    const { show } = useToast({
      icon: 'error'
    })
    const [back] = calendar.$hooks.useBack({ to: 1 })
    const usedNav = calendar.$hooks.useNav()

    events.setHooks({
      toast: show,
      back: back
    })

    return (
      <Container navTitle='地点选择' enablePagePullDownRefresh={false} className='pages-component-edit-location-index' useNav={usedNav} useMenuBtns={usedNav}>
        <View className='van-page-box'>
          <Textarea
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
            placeholder='请输入地址'
            value={place}
            onInput={(e) => setPlace(e.detail.value)}
          ></Textarea>
        </View>

        <View className='van-page-button'>
          <Button type='warning' block onClick={chooseLocation}>
            获取地址
          </Button>
          <Button type='info' block onClick={saveLocation}>
            保存
          </Button>
        </View>
        <Dialog id='locationDialog' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
