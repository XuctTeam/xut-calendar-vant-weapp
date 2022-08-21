/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 14:35:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-21 21:39:57
 * @FilePath: \xut-calendar-vant-weapp\src\app.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/pagination/index',
    'pages/login/index',
    'pages/componentedit/index',
    'pages/componenteditlocation/index',
    'pages/componenteditdescription/index',
    'pages/componenteditalarm/index',
    'pages/componenteditrepeat/index',
    'pages/componenteditcustomrepreat/index',
    'pages/componenteditmembers/index',
    'pages/componenteditmemberchoose/index',
    'pages/calendarmanager/index',
    'pages/calendaredit/index',
    'pages/memberuserinfo/index',
    'pages/memberaccount/index',
    'pages/memberforgetpassword/index',
    'pages/memberregister/index',
    'pages/membermodifyname/index',
    'pages/membermodifypassword/index',
    'pages/memberbindwechat/index',
    'pages/memberbindemail/index',
    'pages/memberbindusername/index',
    'pages/memberbindphone/index',
    'pages/memberaccountmerge/index',
    'pages/addressgroupesmanager/index',
    'pages/addressgroupesedit/index',
    'pages/addressgroupmember/index',
    'pages/addressgroupapply/index',
    'pages/addressgroupsearch/index',
    'pages/onlineservices/index',
    'pages/systemsetting/index',
    'pages/aboutus/index',
    'pages/privacyrule/index'
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
    titlePenetrate: 'YES'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '日程',
        iconPath: 'assets/icon/index.png',
        selectedIconPath: 'assets/icon/index_focus.png'
      },
      {
        pagePath: 'pages/addressgroupesmanager/index',
        text: '通讯录',
        iconPath: 'assets/icon/group.png',
        selectedIconPath: 'assets/icon/group_focus.png'
      },
      // {
      //   pagePath: 'pages/messagemanager/index',
      //   text: '消息',
      //   iconPath: 'assets/icon/message.png',
      //   selectedIconPath: 'assets/icon/message_focus.png',
      // },
      {
        pagePath: 'pages/memberuserinfo/index',
        text: '我的',
        iconPath: 'assets/icon/mine.png',
        selectedIconPath: 'assets/icon/mine_focus.png'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '楚日历需获取您的地理位置'
    }
  }
})
