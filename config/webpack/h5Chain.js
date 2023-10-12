/*
 * @Author: Derek Xu
 * @Date: 2022-09-14 18:30:06
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-12 09:15:11
 * @FilePath: \xut-calendar-vant-weapp\config\webpack\h5Chain.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable import/no-commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */
const H5FixPlugin = require('@antmjs/plugin-h5-fix')
const commonChain = require('./commonChain')

module.exports = function (chain) {
  chain.module.rule('script').use('linariaLoader').loader('@linaria/webpack-loader')
  chain.plugin('H5FixPlugin').use(new H5FixPlugin())
  commonChain(chain)
}
