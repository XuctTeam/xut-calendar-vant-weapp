/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-08 09:36:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 09:30:44
 */
import httpRequest from '@/calendar/api/config'

/**
 * @description: 查询会员所在群组（包括人数）
 * @param phone
 * @param {*} Promise
 * @return {*}
 * @author: Derek Xu
 */
export const groupList = (): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/group')
}

/**
 * @description: 通过群组id查询群组信息（包括人数）
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const getGroupInfo = (id: string): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/group/get', { id })
}

/**
 * @description: 添加群组
 * @param {string} id
 * @param {string} name
 * @param {string} imageUrl
 * @param {string} power
 * @param {number} num
 * @return {*}
 * @author: Derek Xu
 */
export const addGroup = (id: string, name: string, imageUrl: string, password: string, power: string, num: number) => {
  return httpRequest.post('/ums/api/app/v1/group', { id, name, imageUrl, power, password, num })
}

/**
 * @description: 删除群组
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const deleteGroup = (id: string) => {
  return httpRequest.post('/ums/api/app/v1/group/delete', { id })
}

/**
 * @description: 搜索
 * @param {string} word
 * @return {*}
 * @author: Derek Xu
 */
export const search = (word: string, page: number, limit: number, hasPass: string, dateScope: string, numCount: string) => {
  return httpRequest.get('/ums/api/app/v1/group/search', { word, page, limit, hasPass, dateScope, numCount })
}
