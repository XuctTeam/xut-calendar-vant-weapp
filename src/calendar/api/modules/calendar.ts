/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-02 17:45:23
 * @LastEditTime: 2023-10-09 17:31:02
 * @LastEditors: Derek Xu
 */
import { IDavCalendar } from 'types/calendar'
import httpRequest from '../config'

export default {
  /**
   * @description: 查询日历列表
   * @param {*}
   * @return {*}
   * @author: Derek Xu
   */
  list() {
    return httpRequest.get('/cms/api/app/v1/calendar/list')
  },

  /**
   * @description: 查询颜色列表
   * @param {*}
   * @return {*}
   * @author: Derek Xu
   */
  colorsList() {
    return httpRequest.get('/cms/api/app/v1/calendar/color')
  },
  /**
   * @description: 获取日历详情
   * @param {string} id
   * @return {*}
   * @author: Derek Xu
   */
  get(id: string) {
    return httpRequest.get('/cms/api/app/v1/calendar', { id })
  },

  /**
   * @description: 更新日历
   * @param {IDavCalendar} data
   * @return {*}
   * @author: Derek Xu
   */
  update(data: IDavCalendar) {
    return httpRequest.put('/cms/api/app/v1/calendar', data)
  },

  /**
   * @description: 新建日历
   * @param {IDavCalendar} data
   * @return {*}
   * @author: Derek Xu
   */
  create(data: IDavCalendar) {
    return httpRequest.post('/cms/api/app/v1/calendar', data)
  },

  /**
   * @description:  删除日历
   * @param {string} calendarId
   * @return {*}
   * @author: Derek Xu
   */
  remove(calendarId: string) {
    return httpRequest.delete('/cms/api/app/v1/calendar?calendarId=' + calendarId)
  }
}
