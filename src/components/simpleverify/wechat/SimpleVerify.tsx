/* eslint-disable react/no-unused-state */
/*
 * @Author: Derek Xu
 * @Date: 2022-05-19 13:09:40
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-05-24 18:17:41
 * @FilePath: \xuct-calendar-weapp\src\components\simpleverify\wechat\SimpleVerify.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { Component } from 'react'
import { MovableArea, MovableView, View } from '@tarojs/components'

import './index.scss'

interface IPageOption {
  width: number
  success: () => void
}

/**
 * 组件状态
 */
interface StateOption {
  slidingDistance: number
  xDistance: number
  area_width: number
  box_width: number
  slidingWidth: number
  sliderValdationText: string
  areaBgColor: string
  areaTextColor: string
  isFinished: boolean
}

class SimpleVerify extends Component<IPageOption, StateOption> {
  constructor(props) {
    super(props)
    this.state = {
      slidingDistance: 0, //滑块滑动距离
      xDistance: 0, //滑块默认距离
      area_width: 100, //滑块容器总宽度 百分比
      box_width: 40, //滑块的宽px
      slidingWidth: this.props.width - 40, //滑动总宽度
      sliderValdationText: '请按住滑块，拖动到最右边',
      areaBgColor: '#fff',
      areaTextColor: '#666',
      isFinished: false
    }
  }

  slidChange(e) {
    let that = this
    that.setState({
      slidingDistance: e.detail.x
    })
  }

  async touchend() {
    var that = this
    console.log(that.state.slidingDistance, that.state.slidingWidth)
    if (that.state.slidingDistance >= that.state.slidingWidth) {
      that.setState({
        sliderValdationText: '完成验证',
        areaBgColor: '#fd8649',
        areaTextColor: '#fff',
        isFinished: true
      })
      this.props.success()
    } else {
      that.setState({
        xDistance: Math.random()
      })
    }
  }

  /**
   * @description: 增加父类重置方法
   * @return {*}
   */
  public reset() {
    this.setState({
      xDistance: Math.random(),
      isFinished: false,
      areaBgColor: '#fff',
      areaTextColor: '#666',
      sliderValdationText: '请按住滑块，拖动到最右边'
    })
  }

  render() {
    return (
      <View id='container' className='container' style={{ width: `${this.props.width}px` }}>
        <View className='goods-validation'>
          <MovableArea
            className='validation-content'
            style={{ width: this.state.area_width + '%', backgroundColor: this.state.areaBgColor, color: this.state.areaTextColor }}
          >
            {this.state.sliderValdationText}
            <MovableView
              className='validation-box'
              style={{ width: this.state.box_width + 'px' }}
              inertia
              friction={100}
              direction='horizontal'
              x={this.state.xDistance}
              damping={500}
              disabled={this.state.isFinished}
              onChange={this.slidChange.bind(this)}
              onTouchEnd={this.touchend.bind(this)}
            >
              <View className='validation-movable-icon'></View>
            </MovableView>
          </MovableArea>
        </View>
      </View>
    )
  }
}

export default SimpleVerify
