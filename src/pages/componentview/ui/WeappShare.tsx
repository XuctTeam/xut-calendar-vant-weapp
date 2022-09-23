/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-04 15:50:51
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-23 14:02:01
 */
import { FunctionComponent } from 'react'
import { Button, View } from '@tarojs/components'
import { useShareAppMessage } from '@tarojs/taro'
import Images from '@/constants/images'

const DEFAULT_ATTEND_BACKGROUD = Images.DEFAULT_ATTEND_BACKGROUD

interface IPageOption {
  open: boolean
  componentTitle: string
  componentId: string
  onClose: () => void
}

const WeappShare: FunctionComponent<IPageOption> = (props) => {
  useShareAppMessage((res) => {
    console.log(props.componentTitle)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      props.onClose()
    }
    return {
      title: props.componentTitle,
      path: '/pages/componentshareview/index?componentId=' + props.componentId,
      imageUrl: DEFAULT_ATTEND_BACKGROUD
    }
  })

  return (
    <View className='vi-component-view-weapp-share-wrapper'>
      {/* <Dialog open={props.open} onClose={props.onClose}>
        <Dialog.Header>分享朋友圈</Dialog.Header>
        <Dialog.Content>
          <Button openType='share' type='warn'>
            微信分享
          </Button>
        </Dialog.Content>
      </Dialog> */}
    </View>
  )
}

export default WeappShare
