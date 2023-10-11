/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 14:35:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 16:28:01
 * @FilePath: \xut-calendar-vant-weapp\src\app.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
export default defineAppConfig({
  animation: true,
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/messagemanager/index',
    'pages/messagedetailedit/index',
    'pages/componentedit/index',
    'pages/componentsearch/index',
    'pages/componenteditlocation/index',
    'pages/componenteditdescription/index',
    'pages/componenteditalarm/index',
    'pages/componenteditrepeat/index',
    'pages/componenteditcustomrepreat/index',
    'pages/componenteditmembers/index',
    'pages/componenteditmemberchoose/index',
    'pages/componentview/index',
    'pages/componentshareposter/index',
    'pages/componentattend/index',
    'pages/componentshareview/index',
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
    'pages/addressgroupmemberdetail/index',
    'pages/interactionmanager/index',
    'pages/onlineservices/index',
    'pages/systemsetting/index',
    'pages/signinmanager/index',
    'pages/aboutus/index',
    'pages/privacyrule/index'
  ],
  window: {
    // @ts-ignore
    titleBarColor: '#0088FF',
    backgroundColor: '#0088FF',
    backgroundColorTop: '#0088FF',
    backgroundColorBottom: '#0088FF',
    backgroundImageColor: '#0088FF',
    // 微信全局设置自定义导航栏
    navigationStyle: 'custom',
    // 支付宝全局设置自定义导航栏
    transparentTitle: 'always',
    titlePenetrate: 'YES'
  },
  tabBar: {
    color: '#C7CED7',
    selectedColor: '#0088FF',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '日程',
        iconPath: 'assets/icon/home_icon.png',
        selectedIconPath: 'assets/icon/home_a_icon.png'
      },
      {
        pagePath: 'pages/addressgroupesmanager/index',
        text: '通讯录',
        iconPath: 'assets/icon/group_icon.png',
        selectedIconPath: 'assets/icon/group_a_icon.png'
      },
      {
        pagePath: 'pages/interactionmanager/index',
        text: '消息',
        iconPath: 'assets/icon/compass_icon.png',
        selectedIconPath: 'assets/icon/compass_a_icon.png'
      },
      {
        pagePath: 'pages/memberuserinfo/index',
        text: '我的',
        iconPath: 'assets/icon/user_icon.png',
        selectedIconPath: 'assets/icon/user_a_icon.png'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '楚日历需获取您的地理位置'
    }
  },
  requiredPrivateInfos: ['chooseLocation']
})
