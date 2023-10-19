import { getRecoilPromise, setRecoil } from 'recoil-nexus'
import cache from '../../cache'
import store from '../../store'

export const logout = () => {
  cache.cacheRemoveSync('accessToken')
  cache.cacheRemoveSync('refreshToken')
  cache.cacheRemoveSync('userId')
  debugger

  //const userInfoState = getRecoilPromise(store.userInfoStore)

  //console.log(userInfoState)

  // this.hooks['setUserInfoState'](undefined)
  // this.hooks['setUserAuthsState']([])
  // this.hooks['setCalendarState']([])
  // this.hooks['setGroupRefreshTimeStore'](0)
  // this.hooks['setComponentRefreshTimeStore'](0)
}
