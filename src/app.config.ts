/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-14 18:03:23
 * @FilePath: \temptaro\src\app.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/pagination/index',
    'pages/tabAndSearchPagination/index',
  ],
  window: {
    // @ts-ignore
    titleBarColor: '#ededed',
    backgroundColor: '#ededed',
    backgroundColorTop: '#ededed',
    backgroundColorBottom: '#ededed',
    backgroundImageColor: '#ededed',
    // 微信全局设置自定义导航栏
    navigationStyle: 'custom',
    // 支付宝全局设置自定义导航栏
    transparentTitle: 'always',
    titlePenetrate: 'YES',
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '日程',
        iconPath: 'assets/icon/index.png',
        selectedIconPath: 'assets/icon/index_focus.png',
      },
      {
        pagePath: 'pages/pagination/index',
        text: '通讯录',
        iconPath: 'assets/icon/group.png',
        selectedIconPath: 'assets/icon/group_focus.png',
      },
      // {
      //   pagePath: 'pages/messagemanager/index',
      //   text: '消息',
      //   iconPath: 'assets/icon/message.png',
      //   selectedIconPath: 'assets/icon/message_focus.png',
      // },
      // {
      //   pagePath: 'pages/membermine/index',
      //   text: '我的',
      //   iconPath: 'assets/icon/mine.png',
      //   selectedIconPath: 'assets/icon/mine_focus.png',
      // },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '楚日历需获取您的地理位置',
    },
  },
})
