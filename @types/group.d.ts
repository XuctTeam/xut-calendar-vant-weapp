/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-08 09:44:01
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-07-11 08:44:24
 */
export interface IGroup {
  id?: string
  name: string
  no?: string
  createTime: Date
  images?: string
  password?: string
  count?: number
  num: number
  createMemberId: string
  createMemberName?: string
  power: string
  hasPasswordJoin: number
}

/**
 * 通讯录人
 */
export type TMember = {
  id: string
  name: string
  avatar: string
  memberId: string
}

/**
 *  群组通讯录
 */
export interface IGroupMember extends TMember {
  groupId: string
  groupName: string
  groupCreateMemberId?: string
  groupCreateMemberName?: string
  createTime: Date
}

/**
 *  选择通讯通人员
 */
export interface ICheckGroupMember extends TMember {
  checked: boolean
}

/**
 * 按拼音分组
 */
export interface IPinYinGroupMember {
  charCode: string
  members: Array<IGroupMember>
}

/**
 * 分页组
 */
export interface IPageGroup {
  list: Array<IGroup>
  finished: boolean
}
