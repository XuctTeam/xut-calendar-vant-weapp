/*
 * @Description:dva 定义属性
 * @Author: Derek Xu
 * @Date: 2021-11-04 09:12:16
 * @LastEditTime: 2022-07-20 14:49:29
 * @LastEditors: Derek Xu
 */
export interface IUserInfo {
  id: string
  name: string
  avatar?: string
  timeZone: string
}

export interface IUserAuth {
  memberId: string
  username: string
  nickName: string
  avatar: string
  identityType: string
}
