/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-02 08:59:45
 * @LastEditTime: 2023-10-19 13:17:26
 * @LastEditors: Derek Xu
 */
import request from '../request'
import PORT from '../request/port'

export default {
  upload() {
    //@ts-ignore
    return SERVICES_API + PORT.UMS + '/v1/file/upload'
  },
  /**
   * 发送短信
   * @param phone
   * @returns
   */
  sendLoginSmsCode(phone: string) {
    return request.post(PORT.UMS + '/v1/sms/anno/login', { phone, type: 0 })
  },

  /**
   * @description: 绑定或解绑手机发验证
   * @param {boolean} edit
   * @param {string} phone
   * @return {*}
   * @author: Derek Xu
   */
  sendSmsCode(edit: boolean, phone: string) {
    return request.post(PORT.UMS + '/v1/sms', { type: edit ? 4 : 3, phone })
  },

  /**
   * @description: 绑定或解绑邮箱发验证
   * @param {string} email
   * @param {number} type
   * @return {*}
   * @author: Derek Xu
   */
  sendEmailCode(email: string, type: number) {
    return request.post(PORT.UMS + '/v1/email', { email, type })
  }
}
