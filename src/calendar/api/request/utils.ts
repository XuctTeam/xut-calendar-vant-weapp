import cache from '../../cache'

export default function logout() {
  cache.cacheRemoveSync('accessToken')
  cache.cacheRemoveSync('refreshToken')
  cache.cacheRemoveSync('userId')

  //const userInfoState = getRecoilPromise(store.userInfoStore)

  //console.log(userInfoState)

  // this.hooks['setUserInfoState'](undefined)
  // this.hooks['setUserAuthsState']([])
  // this.hooks['setCalendarState']([])
  // this.hooks['setGroupRefreshTimeStore'](0)
  // this.hooks['setComponentRefreshTimeStore'](0)
}
