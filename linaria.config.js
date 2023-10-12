/*
 * @Author: Derek Xu
 * @Date: 2023-10-12 09:04:00
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-12 09:04:47
 * @FilePath: \xut-calendar-vant-weapp\linaria.config.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
module.exports = {
  rules: [
    {
      action: require('@linaria/shaker').default
    },
    {
      test: /node_modules[\/\\](?!@tarojs)/,
      action: 'ignore'
    }
  ]
}
