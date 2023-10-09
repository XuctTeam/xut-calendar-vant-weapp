/*
 * @Author: Derek Xu
 * @Date: 2022-09-14 18:30:07
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 15:31:06
 * @FilePath: \xut-calendar-vant-weapp\config\webpack\miniChain.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const MiniFixPlugin = require('@antmjs/plugin-mini-fix')
const GlobalFixPlugin = require('@antmjs/plugin-global-fix')
const commonChain = require('./commonChain')

module.exports = function (chain) {
  // add @antmjs/plugin-mini-fix and @antmjs/mini-fix
  // 解决微信小程序和抖音小程序的path上的params没有自动decode的问题，支付宝和钉钉是有decode过的
  // 这个问题是因为微信抖音和支付宝钉钉原生小程序的返回结果就是不一致的，Taro目前是没有去处理的
  chain.plugin('MiniFixPlugin').use(new MiniFixPlugin())

  //解决支付宝小程序、钉钉小程序、百度小程序没有暴露全局变量global的问题
  chain.plugin('GlobalFixPlugin').use(new GlobalFixPlugin())
  commonChain(chain)
}
