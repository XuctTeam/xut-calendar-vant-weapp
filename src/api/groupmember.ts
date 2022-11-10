/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-03-09 22:14:22
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-10 08:47:24
 */
import httpRequest from '@/utils/request/innerRequest'

/**
 * @description: 我申请的列表
 * @param {*}
 * @return {*}
 * @author: Derek Xu
 */
export const mineApplyList = () => {
  return httpRequest.get('/ums/api/app/v1/group/mine/apply')
}

/**
 * @description: 申请我的列表
 * @param {*}
 * @return {*}
 * @author: Derek Xu
 */
export const applyMineList = () => {
  return httpRequest.get('/ums/api/app/v1/group/apply/mine')
}

/**
 * @description: 申请加入群组
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const apply = (id: string, password: string) => {
  return httpRequest.post('/ums/api/app/v1/mbr/group/apply', { id, password })
}

/**
 * @description: 同意加入群组
 * @param {string} groupId
 * @param {string} memberId
 * @return {*}
 * @author: Derek Xu
 */
export const applyAgreeJoinGroup = (id: string, action: number) => {
  return httpRequest.post('/ums/api/app/v1/mbr/group/apply/agree', { id, action })
}

/**
 * @description: 拒绝或撤回申请
 * @param {string} groupId
 * @param {string} memberId
 * @return {*}
 * @author: Derek Xu
 */
export const applyRefuseJoinGroup = (id: string, action: number) => {
  return httpRequest.post('/ums/api/app/v1/mbr/group/apply/refuse', { id, action })
}

/**
 * @description: 按拼音分组用户
 * @param {string} groupId
 * @return {*}
 * @author: Derek Xu
 */
export const groupMemberPinYinList = (groupId: string) => {
  return httpRequest.get('/ums/api/app/v1/mbr/group', { groupId })
}

/**
 * @description: 通过群组查询
 * @param {string} groupId
 * @return {*}
 * @author: Derek Xu
 */
export const groupMemberList = (groupId: string) => {
  return httpRequest.get('/ums/api/app/v1/mbr/group/query', { groupId })
}

/**
 * @description: 会员主动退出或被请出群组
 * @param {string} groupId
 * @param {number} action
 * @param {string} memberId
 * @return {*}
 * @author: Derek Xu
 */
export const groupMemberLeave = (groupId: string, action: number, memberId?: string) => {
  return httpRequest.post('/ums/api/app/v1/mbr/group/leave', { groupId, action, memberId })
}

/**
 * @description: 通过id查询用户
 * @param {string} ids
 * @return {*}
 */
export const queryByIds = (ids: string[]) => {
  return httpRequest.post('/ums/api/app/v1/mbr/group/ids', { ids })
}

/**
 * @description 查询组内用户
 * @param groupId
 * @param memberId
 */
export const getGroupMember = (groupId: string, memberId) => {
  return httpRequest.get('/ums/api/app/v1/mbr/group/get', { groupId, memberId })
}
