/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-02-22 16:22:05
 * @LastEditTime: 2022-08-08 16:06:56
 * @LastEditors: Derek Xu
 */
import { registerMiddleware, RouteContext, Router } from 'tarojs-router-next'
import { cacheGetSync } from '@/cache'

registerMiddleware(
  async (_, next) => {
    const token = cacheGetSync('accessToken')
    if (!token) {
      Router.toLogin()
      // 直接返回，不执行 next 即可打断中间件向下执行
      return
    }
    await next()
  },
  // 中间件注册条件
  (ctx: RouteContext<{ mustLogin: boolean }>) => {
    // 仅当页面需要登录时才注册该中间件
    return ctx.route.ext?.mustLogin === true
  },
)
