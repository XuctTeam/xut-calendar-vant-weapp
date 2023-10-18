/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 14:35:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 10:07:59
 * @FilePath: \xut-calendar-vant-weapp\config\development.js
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    SERVICES_IMAGES: JSON.stringify('https://images.xuct.net.cn/'),
    /** 后台服务地址 */
    SERVICES_API: JSON.stringify('https://s3.nsloop.com:22990')
  },
  mini: {},
  h5: {}
}
