/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-03 09:31:21
 * @LastEditTime: 2022-10-21 09:05:23
 * @LastEditors: Derek Xu
 */
import http from '@/utils/request/innerRequest'

/**
 * @description: 微信登录
 * @param {string} code
 * @param {string} iv
 * @param {string} encryptedData
 * @return {*}
 * @author: Derek Xu
 */
export const wechatLogin = (code: string, iv: string, encryptedData: string): Promise<any> => {
  return http.post(
    `/uaa/oauth2/token?grant_type=wx&scope=server&code=${encodeURIComponent(code)}&iv=${iv}&encryptedData=${encodeURIComponent(encryptedData)}`,
    {}
  )
}

/**
 * @description: 电话号码登录
 * @param {string} phone
 * @param {string} code
 * @return {*}
 * @author: Derek Xu
 */
export const phoneLogin = (phone: string, code: string): Promise<any> => {
  return http.post(`/uaa/oauth2/token?grant_type=app&scope=server&phone=${phone}&code=${code}&login_type=phone`, {})
}

/**
 * @description: 账号密码登录
 * @param {string} username
 * @param {string} password
 * @return {*}
 * @author: Derek Xu
 */
export const usernameLogin = (username: string, password: string): Promise<any> => {
  return http.post(`/uaa/oauth2/token?grant_type=app&scope=server&username=${username}&password=${password}&login_type=password`, {})
}

/**
 * @description: 刷新token
 * @param {string} refresh_token
 * @return {*}
 * @author: Derek Xu
 */
export const tokenRefresh = (refresh_token: string): Promise<any> => {
  return http.post(`/uaa/oauth2/token?grant_type=refresh_token&refresh_token=${refresh_token}`, {})
}
