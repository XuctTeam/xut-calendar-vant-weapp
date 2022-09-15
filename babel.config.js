/*
 * @Author: Derek Xu
 * @Date: 2022-08-09 19:10:39
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-15 09:08:37
 * @FilePath: \xut-calendar-vant-weapp\babel.config.js
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: true,
        useBuiltIns: 'usage'
      }
    ]
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
