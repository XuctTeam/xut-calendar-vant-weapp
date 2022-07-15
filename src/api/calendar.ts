/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-02 17:45:23
 * @LastEditTime: 2022-05-02 21:52:05
 * @LastEditors: Derek Xu
 */
import http from '@/utils/request'

import { IDavCalendar } from '~/../@types/calendar'

/**
 * @description: 查询日历列表
 * @param {*}
 * @return {*}
 * @author: Derek Xu
 */
export const list = () => {
  return http.get('/cms/api/app/v1/calendar/list')
}

/**
 * @description: 查询颜色列表
 * @param {*}
 * @return {*}
 * @author: Derek Xu
 */
export const colorsList = () => {
  return http.get('/cms/api/app/v1/calendar/color')
}

/**
 * @description: 获取日历详情
 * @param {string} id
 * @return {*}
 * @author: Derek Xu
 */
export const get = (id: string) => {
  return http.get('/cms/api/app/v1/calendar', { id })
}

/**
 * @description: 更新日历
 * @param {IDavCalendar} data
 * @return {*}
 * @author: Derek Xu
 */
export const update = (data: IDavCalendar) => {
  return http.put('/cms/api/app/v1/calendar', data)
}

/**
 * @description: 新建日历
 * @param {IDavCalendar} data
 * @return {*}
 * @author: Derek Xu
 */
export const create = (data: IDavCalendar) => {
  return http.post('/cms/api/app/v1/calendar', data)
}

/**
 * @description:  删除日历
 * @param {string} calendarId
 * @return {*}
 * @author: Derek Xu
 */
export const remove = (calendarId: string) => {
  return http.delete('/cms/api/app/v1/calendar?calendarId=' + calendarId)
}
