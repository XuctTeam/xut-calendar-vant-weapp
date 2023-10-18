/*
 * @Author: Derek Xu
 * @Date: 2023-10-10 09:27:12
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 14:01:35
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\api\interface\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
export namespace Login {
  export interface LoginResult {
    access_token: string
    client_id: string
    refresh_token: string
    user_name: string
    user_id: string
  }
}
