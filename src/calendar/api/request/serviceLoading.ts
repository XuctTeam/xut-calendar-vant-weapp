/*
 * @Author: Derek Xu
 * @Date: 2023-05-29 10:42:33
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 19:25:31
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\api\request\serviceLoading.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */

import Taro from '@tarojs/taro'

/* 全局请求 loading */

/**
 * @description 开启 Loading
 * */
const startLoading = () => {
  Taro.showLoading({
    title: '加载中',
    mask: true
  })
}

/**
 * @description 结束 Loading
 * */
const endLoading = () => {
  setTimeout(() => {
    Taro.hideLoading()
  }, 300)
}

/**
 * @description 显示全屏加载
 * */
let needLoadingRequestCount = 0
export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

/**
 * @description 隐藏全屏加载
 * */
export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
