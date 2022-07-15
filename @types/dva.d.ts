/*
 * @Description:dva 定义属性
 * @Author: Derek Xu
 * @Date: 2021-11-04 09:12:16
 * @LastEditTime: 2022-05-26 11:01:42
 * @LastEditors: Derek Xu
 */
//import { Dispatch } from 'redux'
interface IDvaLoadingProps {
  global: boolean
  models: { [type: string]: boolean | undefined }
  effects: { [type: string]: boolean | undefined }
}

// by lazen at 2020-04-01
export interface DvaProps {
  dispatch: any
  loading?: IDvaLoadingProps
}

export interface IUserAuth {
  memberId: string
  username: string
  nickName: string
  avatar: string
  identityType: string
}

export interface IUserInfo {
  id: string
  name: string
  avatar?: string
  timeZone: string
}

interface ICommonProps {
  accessToken: string
  userInfo: IUserInfo
  auths: IUserAuth[]
  lunar: boolean
  monday: boolean
  view: number
}

export interface IDvaCommonProps {
  loading?: IDvaLoadingProps
  common: ICommonProps
}
