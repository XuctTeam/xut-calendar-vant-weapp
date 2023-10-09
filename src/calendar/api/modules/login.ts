/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-03 09:31:21
 * @LastEditTime: 2023-10-09 16:30:29
 * @LastEditors: Derek Xu
 */
import qs from 'qs'
import http from '@/calendar/api/config'

export default {
  /**
   * @description: 微信登录
   * @param {string} code
   * @param {string} iv
   * @param {string} encryptedData
   * @return {*}
   * @author: Derek Xu
   */
  wxLogin(code: string, iv: string, encryptedData: string) {
    return http.post(
      `/uaa/oauth2/token?grant_type=wx&scope=server&code=${encodeURIComponent(code)}&iv=${iv}&encryptedData=${encodeURIComponent(encryptedData)}`,
      {}
    )
  },

  /**
   * @description: 电话号码登录
   * @param {string} phone
   * @param {string} code
   * @return {*}
   * @author: Derek Xu
   */
  phoneLogin(phone: string, code: string) {
    return http.post(`/uaa/oauth2/token?grant_type=app&scope=server&phone=${phone}&code=${code}&login_type=phone`, {})
  },

  /**
   * @description: 账号密码登录
   * @param {string} username
   * @param {string} password
   * @return {*}
   * @author: Derek Xu
   */
  usernameLogin(username: string, password: string) {
    // eslint-disable-next-line import/no-named-as-default-member
    const dataObj = qs.stringify({ username: username, password: password })
    return http.post(`/uaa/oauth2/token?grant_type=app&scope=server&login_type=password`, dataObj, 'application/x-www-form-urlencoded')
  },

  /**
   * @description: 刷新token
   * @param {string} refresh_token
   * @return {*}
   * @author: Derek Xu
   */
  tokenRefresh(refresh_token: string) {
    return http.post(`/uaa/oauth2/token?grant_type=refresh_token&refresh_token=${refresh_token}`, {})
  }
}
