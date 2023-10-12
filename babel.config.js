/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-12 09:00:46
 * @FilePath: \xut-calendar-vant-weapp\babel.config.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable import/no-commonjs */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: true,
        useBuiltIns: false,
        hot: false
      }
    ],
    '@linaria'
  ],
  plugins: [
    ['lodash'],
    [
      'import',
      {
        libraryName: '@antmjs/vantui',
        libraryDirectory: 'es'
      },
      '@antmjs/vantui'
    ]
  ]
}
