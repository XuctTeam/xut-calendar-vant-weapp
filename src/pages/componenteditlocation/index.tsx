/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-17 17:48:32
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componenteditlocation\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { CellGroup, Button, Col, Field, Row, Unite, Dialog } from '@antmjs/vantui'
import { Textarea, View } from '@tarojs/components'
import Container from '@/components/container'
import Header from '@/components/header'
import Taro from '@tarojs/taro'
import { useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'
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
      const that = this
      Taro.chooseLocation({
        success(res) {
          that.setState({
            place: res.address
          })
        },
        fail: function (res) {
          console.log(res)
          if (process.env.TARO_ENV === 'weapp') {
            that._openSetting()
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    saveLoaction() {
      this.hooks['back']({
        data: {
          place: this.state.place
        }
      })
    },

    _openSetting() {
      const that = this
      Taro.getSetting({
        success: function (res) {
          var statu = res.authSetting
          if (!statu['scope.userLocation']) {
            Dialog.confirm({
              title: '是否授权当前位置',
              message: '需要获取您的地理位置',
              selector: 'locationDialog'
            }).then((value) => {
              if (value === 'cancel') return
              that._openSettingChoose()
            })
          }
        }
      })
    },

    _openSettingChoose() {
      const that = this
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
                that.setState({
                  place: rs.address
                })
              }
            })
          } else {
            that.hooks['toast']('授权失败')
          }
        }
      })
    }
  },
  function ({ state, events }) {
    const { place } = state
    const { setPlace, chooseLocation, saveLoaction } = events
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 1
    })

    events.setHooks({
      toast: toast,
      back: back
    })

    return (
      <Container
        navTitle='地点选择'
        enablePagePullDownRefresh={false}
        className='pages-component-edit-location-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='地点选择' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Textarea
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
            placeholder='请输入地址'
            value={place}
            onInput={(e) => setPlace(e.detail.value)}
          ></Textarea>
        </View>

        <View className='van-page-button'>
          <Row>
            <Col span={12}>
              <Button type='info' onClick={saveLoaction}>
                保存
              </Button>
            </Col>
            <Col span={12}>
              <Button type='warning' onClick={chooseLocation}>
                获取地址
              </Button>
            </Col>
          </Row>
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