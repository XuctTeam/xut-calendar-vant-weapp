/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-28 16:02:47
 * @LastEditTime: 2022-04-20 21:04:04
 * @LastEditors: Derek Xu
 */
import http from '@/utils/request'

/**
 * @description: 忘记密码 -> 发送验证码
 * @param {string} phone
 * @param {string} email
 * @param {number} type
 * @return {*}
 * @author: Derek Xu
 */
export const sendForgetPasswordCode = (phone: string, email: string, type: number) => {
  return http.post('/uaa/forget/password/code', { phone, email, type })
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
  return http.post('/uaa/forget/password/check', { phone, email, code, type })
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
  return http.post('/uaa/forget/password/modify', { memberId, password: pwd, code })
}
