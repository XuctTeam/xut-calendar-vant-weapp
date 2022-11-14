import { useEffect, useState, useCallback } from 'react'
import { navigateBack, reLaunch, getCurrentPages, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Icon } from '@antmjs/vantui'
import { useRecoilValue } from 'recoil'
import { menuButtonStore } from '@/store'
import './leftBtns.less'

interface IMenuButtonProps {
  menuButton: any
  homeUrl: string
}

function MenuButton(props: IMenuButtonProps) {
  const { menuButton, homeUrl } = props
  const router = useRouter()

  const handleGoBack = useCallback(() => {
    /** 日程新增到观看页，返回到首页 */
    let delta = 1
    const { path, params } = router
    /** 1.首页点击 2.新增后 3.搜索 */
    const { from } = params
    if (path.includes('/pages/componentview/index') && from && from === '2') {
      delta = 2
    }
    navigateBack({
      delta
    })
  }, [])

  const handleGoHome = useCallback(() => {
    reLaunch({
      url: '/' + homeUrl
    })
  }, [homeUrl])

  const [backButton, setBackButton] = useState(false)
  const [homeButton, setHomeButton] = useState(false)
  useEffect(
    function () {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const ins = pages[pages.length - 1]
        let url = ins?.route || ins?.['__route__']
        if (pages.length > 1) {
          setBackButton(true)
        }
        if (url && url[0] === '/') {
          url = url.substring(1)
        }
        if (url?.split('?')[0] !== homeUrl) {
          setHomeButton(true)
        }
      }
    },
    [homeUrl]
  )

  return (
    <>
      <View
        className='navigation_minibar_left'
        style={{
          top: `${menuButton!.top}px`,
          left: `${menuButton!.marginRight}px`,
          width: `${menuButton!.width}px`,
          height: `${menuButton!.height}px`,
          display: !backButton && !homeButton ? 'none' : 'flex'
        }}
      >
        {backButton && (
          <View
            className='navigation_minibar_left_back'
            style={{
              width: `${menuButton!.height}px`,
              height: `${menuButton!.height}px`,
              marginRight: '10px'
            }}
            onClick={handleGoBack}
          >
            <Icon name='arrow-left' />
          </View>
        )}
        {homeButton && (
          <View
            className='navigation_minibar_left_home'
            style={{
              width: `${menuButton!.height}px`,
              height: `${menuButton!.height}px`
            }}
            onClick={handleGoHome}
          >
            <Icon name='wap-home' />
          </View>
        )}
      </View>
    </>
  )
}

type IProps = {
  homeUrl: string
}

export default function Index(props: IProps) {
  const { homeUrl } = props
  const menuButton: any = useRecoilValue(menuButtonStore)

  return menuButton && process.env.TARO_ENV !== 'alipay' ? <MenuButton menuButton={menuButton} homeUrl={homeUrl} /> : <></>
}
