/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-28 16:02:47
 * @LastEditTime: 2022-11-07 17:48:14
 * @LastEditors: Derek Xu
 */
import httpRequest from '@/utils/request/innerRequest'

/**
 * @description: 忘记密码 -> 发送短信验证码
 * @param phone
 * @returns
 */
export const sendForgetSmsCode = (phone) => {
  return httpRequest.post('/ums/api/app/v1/sms/anno/forget', { phone, type: 2 })
}

/**
 * @description: 忘记密码 -> 发送验证码
 * @param {string} phone
 * @param {string} email
 * @param {number} type
 * @return {*}
 * @author: Derek Xu
 */
export const sendForgetEmailCode = (email: string) => {
  return httpRequest.post('/ums/api/app/v1/email/anno/forget', { email, type: 2 })
}

/**
 * @description:忘记密码 -> 认证用户
 * @param {string} phone
 * @param {string} email
 * @param {string} code
 * @param {number} type
 * @return {*}
 * @author: Derek Xu
 */
export const forgetPasswordCheck = (phone: string, email: string, code: string, type: number) => {
  return httpRequest.post('/ums/api/app/v1/member/anno/forget/check', { phone, email, code, type })
}

/**
 * @description: 忘记密码 -> 修改密码
 * @param {string} memberId
 * @param {string} pwd
 * @param {string} code
 * @return {*}
 * @author: Derek Xu
 */
export const forgetModify = (memberId: string, pwd: string, code: string) => {
  return httpRequest.post('/ums/api/app/v1/member/anno/forget/modify', { memberId, password: pwd, code })
}
