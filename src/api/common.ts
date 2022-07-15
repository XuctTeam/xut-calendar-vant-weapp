/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-02 08:59:45
 * @LastEditTime: 2022-04-20 21:03:48
 * @LastEditors: Derek Xu
 */
import http from '@/utils/request'

export const upload = (): string => {
  //@ts-ignore
  return SERVICES_API + '/ums/api/v1/common/file/upload'
}

/**
 * @description: 绑定或解绑手机发验证
 * @param {boolean} edit
 * @param {string} phone
 * @return {*}
 * @author: Derek Xu
 */
export const sendUmsSmsCode = (edit: boolean, phone: string): Promise<any> => {
  return http.post('/ums/api/v1/common/sms', { type: edit ? 2 : 1, phone })
}

/**
 * @description: 绑定或解绑邮箱发验证
 * @param {string} email
 * @param {number} type
 * @return {*}
 * @author: Derek Xu
 */
export const sendUmsEmailCode = (email: string, type: number) => {
  return http.post('/ums/api/v1/common/email', { email, type })
}
