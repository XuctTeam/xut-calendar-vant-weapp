/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-02 08:59:45
 * @LastEditTime: 2022-10-14 20:18:27
 * @LastEditors: Derek Xu
 */
import request from '@/utils/request/innerRequest'

export const upload = (): string => {
  //@ts-ignore
  return SERVICES_API + '/ums/api/v1/common/file/upload'
}

export const sendLoginSmsCode = (phone: string) => {
  return request.post('/ums/api/v1/common/sms/login', { phone })
}

/**
 * @description: 绑定或解绑手机发验证
 * @param {boolean} edit
 * @param {string} phone
 * @return {*}
 * @author: Derek Xu
 */
export const sendSmsCode = (edit: boolean, phone: string): Promise<any> => {
  return request.post('/ums/api/v1/common/sms', { type: edit ? 2 : 1, phone })
}

/**
 * @description: 绑定或解绑邮箱发验证
 * @param {string} email
 * @param {number} type
 * @return {*}
 * @author: Derek Xu
 */
export const sendEmailCode = (email: string, type: number) => {
  return request.post('/ums/api/v1/common/email', { email, type })
}
