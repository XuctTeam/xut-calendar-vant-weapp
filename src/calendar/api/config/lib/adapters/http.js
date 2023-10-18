/*
 * @Author: Derek Xu
 * @Date: 2023-10-18 19:17:57
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 19:18:46
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\api\config\lib\adapters\http.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
import Taro from '@tarojs/taro'

export default function adapter(config) {
  return new Promise((resolve, reject) => {
    const requestTask = Taro.request({
      ...config,
      complete: (result) => {
        // 根据状态码判断要执行的触发的状态
        const response = { config, ...result }
        !config.validateStatus || config.validateStatus(result.statusCode) ? resolve(response) : reject(response)
      }
    })

    config.fetcher?.resolve(requestTask)
  })
}
