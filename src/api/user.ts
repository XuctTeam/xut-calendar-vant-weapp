/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-10 19:52:50
 * @LastEditTime: 2022-10-08 08:57:46
 * @LastEditors: Derek Xu
 */
import httpRequest from '@/utils/request/innerRequest'

/**
 * 退出
 * @returns
 */
export const logout = (): Promise<any> => {
  return httpRequest.delete('/uaa/token/logout')
}

/**
 * 获取当前用户及所有认证方式
 * @returns
 */
export const userInfo = (): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/member/info/all')
}

/**
 * @description:  获取当前用户基础信息
 * @param {*} Promise
 * @return {*}
 */
export const baseUserInfo = (): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/member/info/base')
}

/**
 * @description: 获取当前用户所有认证方式
 * @param {*} Promise
 * @return {*}
 */
export const auths = (): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/member/auths')
}

/**
 * @description: 查询用户小程序认证
 * @param {*} Promise
 * @return {*}
 */
export const getWechatAuth = (): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/member/auth/wechat')
}

/**
 * @description:  修改密码
 * @param {string} pwd
 * @return {*}
 */
export const password = (pwd: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/password', { password: pwd })
}

/**
 * @description: 修改名称
 * @param {string} name
 * @return {*}
 */
export const updateName = (name: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/name', { name })
}

/**
 * @description: 通过ID查询名称
 * @param {string} memberId
 * @return {*}
 */
export const getName = (memberId: string): Promise<any> => {
  return httpRequest.get('/ums/api/app/v1/member/name', { memberId })
}

/**
 * @description: 修改头像
 * @param {string} avatar
 * @return {*}
 */
export const updateAvatar = (avatar: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/avatar', { avatar })
}

/**
 * @description: 获取微信手机号码
 * @param {string} encryptedData
 * @param {string} ivStr
 * @return {*}
 */
export const getPhoneNumber = (code: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/phone/get', { code })
}

/**
 * @description: 手机号绑定
 * @param {string} phone
 * @param {string} code
 * @return {*}
 */
export const bindPhone = (phone: string, code: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/phone/bind', { phone, code })
}

/**
 * @description: 手机号解绑
 * @param {string} phone
 * @param {string} code
 * @return {*}
 */
export const unbindPhone = (phone: string, code: string): Promise<any> => {
  return httpRequest.post('/ums/api/app/v1/member/phone/unbind', { phone, code })
}

/**
 * @description: 绑定账号
 * @param {any} formData
 * @return {*}
 */
export const bindUserName = (formData: any) => {
  return httpRequest.post('/ums/api/app/v1/member/username/bind', formData)
}

/**
 * @description: 绑定邮箱
 * @param {string} email
 * @param {string} code
 * @return {*}
 */
export const bindEmail = (email: string, code: string) => {
  return httpRequest.post('/ums/api/app/v1/member/email/bind', { email, code })
}

/**
 * @description: 解绑邮箱
 * @param {string} email
 * @param {string} code
 * @return {*}
 */
export const unbindEmail = (email: string, code: string) => {
  return httpRequest.post('/ums/api/app/v1/member/email/unbind', { email, code })
}

/**
 * @description: 微信绑定
 * @param {string} code
 * @param {string} encryptedData
 * @param {string} iv
 * @return {*}
 */
export const bindWx = (code: string, encryptedData: string, iv: string) => {
  return httpRequest.post('/ums/api/app/v1/member/wx/bind', { code, encryptedData, iv })
}

/**
 * @description: 更新用户信息为微信
 * @param {*}
 * @return {*}
 */
export const updateWxInfo = () => {
  return httpRequest.post('/ums/api/app/v1/member/wx/update/info', {})
}

/**
 * @description: 合并账号
 * @param {*}
 * @return {*}
 * @author: Derek Xu
 */
export const merge = (phone: string) => {
  return httpRequest.post('/ums/api/app/v1/member/merge', { phone })
}

/**
 * @description: 获取注册图形码
 * @param {*} Promise
 * @return {*}
 */
export const captcha = (randomStr: string): Promise<any> => {
  return httpRequest.get('/code?randomStr=' + randomStr)
}

/**
 * @description: 发送注册短信验证码
 * @param {string} phone
 * @return {*}
 */
export const sendRegisterSms = (phone: string) => {
  return httpRequest.post('/uaa/register/sms', { phone })
}

/**
 * @description: 发送注册邮件验证码
 * @param {string} email
 * @return {*}
 */
export const sendRegisterEmail = (email: string) => {
  return httpRequest.post('/uaa/register/email/code', { email })
}

/**
 * @description: 会员注册
 * @param {any} formData
 * @return {*}
 * @author: Derek Xu
 */
export const register = (formData: any) => {
  return httpRequest.post('/uaa/register', formData)
}
