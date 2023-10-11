/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-02-17 14:04:42
 * @LastEditTime: 2023-10-10 10:36:39
 * @LastEditors: Derek Xu
 */
import httpRequest from '@/calendar/api/config'

export default {
  /**
   * @description: 查询列表
   * @param {number} page
   * @param {number} limit
   * @param {number} status
   * @return {*}
   * @author: Derek Xu
   */
  list(page: number, limit: number, title?: string) {
    return httpRequest.get('/ums/api/app/v1/message/list', { page, limit, title })
  },

  /**
   * @description: 已读消息
   * @param {string} id
   * @return {*}
   * @author: Derek Xu
   */
  read(id: string) {
    return httpRequest.post('/ums/api/app/v1/message', { id })
  },

  /**
   * @description: 获取消息
   * @param {string} id
   * @return {*}
   * @author: Derek Xu
   */
  get(id: string) {
    return httpRequest.get('/ums/api/app/v1/message', { id })
  },

  /**
   * @description: 查询总数
   * @return {*}
   */
  count() {
    return httpRequest.get('/ums/api/app/v1/message/count')
  },

  /**
   * @description: 清除未读
   * @return {*}
   */
  clear() {
    return httpRequest.post('/ums/api/app/v1/message/clear', {})
  },

  /**
   * @description: 删除消息
   * @param {*} id
   * @return {*}
   */
  remove(id: string) {
    return httpRequest.delete('/ums/api/app/v1/message/'.concat(id))
  },

  /**
   * @description: 批量删除
   * @param {*} ids
   * @return {*}
   */
  removeAll(ids: string[]) {
    return httpRequest.delete('/ums/api/app/v1/message/batch', { ids })
  },

  /**
   * @description: 批量已读
   * @param {string} ids
   * @return {*}
   */
  readAll(ids: string[]) {
    return httpRequest.post('/ums/api/app/v1/message/batch', { ids })
  }
}
