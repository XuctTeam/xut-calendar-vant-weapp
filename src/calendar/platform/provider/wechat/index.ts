/*
 * @Author: Derek Xu
 * @Date: 2023-10-09 17:07:48
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-09 17:15:48
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\platform\provider\wechat\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import Taro, { getUpdateManager, showModal } from '@tarojs/taro'

async function load() {
  checkUpdate()
  const result = await Taro.checkSession()
  // 小程序的接口改动太频繁了 强制每次进入都重新获取
  const sessionStatus = result
  if (!sessionStatus) {
    getSessionId()
  }
  //getSubscribeTemplate()
}

const checkUpdate = () => {
  if (process.env.TARO_ENV === 'h5') {
    return
  }

  const updateManager: any = getUpdateManager()
  updateManager.onCheckForUpdate(async (res: any) => {
    if (res.hasUpdate) {
    }
  })
  updateManager.onUpdateReady(() => {
    showModal({
      title: '更新提示',
      content: '新版本已经准备好，立即重启应用？',
      confirmText: '我知道了',
      showCancel: false
    }).then(function (mRes: any): void {
      if (mRes.confirm) {
        updateManager.applyUpdate()
      }
    })
  })

  updateManager.onUpdateFailed(() => {
    showModal({
      title: '更新失败',
      content: '请删除小程序后重新打开',
      confirmText: '我知道了',
      showCancel: false
    }).then(function (): void {})
  })
}

// 获取最新sessionId
const getSessionId = async () => {
  // 获取code
  let code = ''
  const loginResult = await Taro.login()
  if (loginResult.errMsg === 'login:ok') {
    code = loginResult.code
  } else {
    getSessionId()
    return false
  }
  //$store.wx().getSession({ code })
  return true
}

export default { load }
