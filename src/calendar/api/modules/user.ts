/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-10 19:52:50
 * @LastEditTime: 2023-10-09 16:41:49
 * @LastEditors: Derek Xu
 */
import httpRequest from '@/calendar/api/config'

export default {
  /**
   * 退出
   * @returns
   */
  logout() {
    return httpRequest.delete('/uaa/token/logout')
  },

  /**
   * 获取当前用户及所有认证方式
   * @returns
   */
  userInfo() {
    return httpRequest.get('/ums/api/app/v1/member/info/all')
  },

  /**
   * @description:  获取当前用户基础信息
   * @param {*} Promise
   * @return {*}
   */
  baseUserInfo() {
    return httpRequest.get('/ums/api/app/v1/member/info/base')
  },

  /**
   * @description: 获取当前用户所有认证方式
   * @param {*} Promise
   * @return {*}
   */
  auths() {
    return httpRequest.get('/ums/api/app/v1/member/auths')
  },

  /**
   * @description: 查询用户小程序认证
   * @param {*} Promise
   * @return {*}
   */
  getWechatAuth() {
    return httpRequest.get('/ums/api/app/v1/member/auth/wechat')
  },

  /**
   * @description:  修改密码
   * @param {string} pwd
   * @return {*}
   */
  password(pwd: string) {
    return httpRequest.post('/ums/api/app/v1/member/password', { password: pwd })
  },

  /**
   * @description: 修改名称
   * @param {string} name
   * @return {*}
   */
  updateName(name: string) {
    return httpRequest.post('/ums/api/app/v1/member/name', { name })
  },

  /**
   * @description: 通过ID查询名称
   * @param {string} memberId
   * @return {*}
   */
  getName(memberId: string) {
    return httpRequest.get('/ums/api/app/v1/member/name', { memberId })
  },

  /**
   * @description: 修改头像
   * @param {string} avatar
   * @return {*}
   */
  updateAvatar(avatar: string) {
    return httpRequest.post('/ums/api/app/v1/member/avatar', { avatar })
  },

  /**
   * @description: 获取微信手机号码
   * @param {string} encryptedData
   * @param {string} ivStr
   * @return {*}
   */
  getPhoneNumber(code: string) {
    return httpRequest.post('/ums/api/app/v1/member/phone/get', { code })
  },

  /**
   * @description: 手机号绑定
   * @param {string} phone
   * @param {string} code
   * @return {*}
   */
  bindPhone(phone: string, code: string) {
    return httpRequest.post('/ums/api/app/v1/member/phone/bind', { phone, code })
  },

  /**
   * @description: 手机号解绑
   * @param {string} phone
   * @param {string} code
   * @return {*}
   */
  unbindPhone(phone: string, code: string) {
    return httpRequest.post('/ums/api/app/v1/member/phone/unbind', { phone, code })
  },

  /**
   * @description: 绑定账号
   * @param {any} formData
   * @return {*}
   */
  bindUserName(formData: any) {
    return httpRequest.post('/ums/api/app/v1/member/username/bind', formData)
  },

  /**
   * @description: 绑定邮箱
   * @param {string} email
   * @param {string} code
   * @return {*}
   */
  bindEmail(email: string, code: string) {
    return httpRequest.post('/ums/api/app/v1/member/email/bind', { email, code })
  },

  /**
   * @description: 解绑邮箱
   * @param {string} email
   * @param {string} code
   * @return {*}
   */
  unbindEmail(email: string, code: string) {
    return httpRequest.post('/ums/api/app/v1/member/email/unbind', { email, code })
  },

  /**
   * @description: 微信绑定
   * @param {string} code
   * @param {string} encryptedData
   * @param {string} iv
   * @return {*}
   */
  bindWx(code: string, encryptedData: string, iv: string) {
    return httpRequest.post('/ums/api/app/v1/member/wx/bind', { code, encryptedData, iv })
  },

  /**
   * @description: 更新用户信息为微信
   * @param {*}
   * @return {*}
   */
  updateWxInfo() {
    return httpRequest.post('/ums/api/app/v1/member/wx/update/info', {})
  },

  /**
   * @description: 合并账号
   * @param {*}
   * @return {*}
   * @author: Derek Xu
   */
  merge(phone: string) {
    return httpRequest.post('/ums/api/app/v1/member/merge', { phone })
  },

  /**
   * @description: 发送注册短信验证码
   * @param {string} phone
   * @return {*}
   */
  sendRegisterSms(phone: string) {
    return httpRequest.post('/ums/api/app/v1/sms/anno/register', { phone, type: 1 })
  },

  /**
   * @description: 发送注册邮件验证码
   * @param {string} email
   * @return {*}
   */
  sendRegisterEmail(email: string) {
    return httpRequest.post('/ums/api/app/v1/email/anno/register', { email, type: 1 })
  },

  /**
   * @description: 会员注册
   * @param {any} formData
   * @return {*}
   * @author: Derek Xu
   */
  register(formData: any) {
    return httpRequest.post('/ums/api/app/v1/member/anno/register', formData)
  }
}
