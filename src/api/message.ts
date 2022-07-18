/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-02-17 14:04:42
 * @LastEditTime: 2022-07-16 17:04:22
 * @LastEditors: Derek Xu
 */
import httpRequest from '@/utils/request/innerRequest'

/**
 * @description: 查询列表
 * @param {number} page
 * @param {number} limit
 * @param {number} status
 * @return {*}
 * @author: Derek Xu
 */
export const list = (page: number, limit: number, title?: string) => {
  return httpRequest.get('/ums/api/app/v1/message/list', { page, limit, title })
}

/**
 * @description: 已读消息
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const read = (id: string) => {
  return httpRequest.post('/ums/api/app/v1/message', { id })
}

/**
 * @description: 获取消息
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const get = (id: string) => {
  return httpRequest.get('/ums/api/app/v1/message', { id })
}

/**
 * @description: 查询总数
 * @return {*}
 */
export const count = () => {
  return httpRequest.get('/ums/api/app/v1/message/count')
}

/**
 * @description: 清除未读
 * @return {*}
 */
export const clear = () => {
  return httpRequest.post('/ums/api/app/v1/message/clear', {})
}

/**
 * @description: 删除消息
 * @param {*} id
 * @return {*}
 */
export const remove = (id) => {
  return httpRequest.delete('/ums/api/app/v1/message/'.concat(id))
}

/**
 * @description: 批量删除
 * @param {*} ids
 * @return {*}
 */
export const removeAll = (ids: string[]) => {
  return httpRequest.delete('/ums/api/app/v1/message/batch', { ids })
}

/**
 * @description: 批量已读
 * @param {string} ids
 * @return {*}
 */
export const readAll = (ids: string[]) => {
  return httpRequest.post('/ums/api/app/v1/message/batch', { ids })
}
