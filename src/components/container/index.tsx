import { PureComponent, ReactNode, useState, useContext, useEffect } from 'react'
import { showToast, usePageScroll } from '@tarojs/taro'
import { UniteContext } from '@antmjs/unite'
import { EMlf } from '@antmjs/trace'
import { useSpring } from '@react-spring/web'
import { monitor } from '@/trace'
import { LOGIN_CODE } from '@/constants'
import Error from '../fullScreen/error'
import Loading from '../fullScreen/loading'
import PullDownRefresh from './pullDownRefresh'
import Navigation from './navigation'
import './index.less'

class ErrorBoundary extends PureComponent<{ setError: any; children: any }> {
  constructor(props: any) {
    super(props)
  }
  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('componentDidCatch', error, errorInfo)
    }
    monitor(EMlf.js, {
      d1: 'componentDidCatch',
      d2: JSON.stringify(error || ''),
      d3: JSON.stringify(errorInfo || '')
    })
    const showError = {
      code: 'BoundaryError',
      message: '渲染出现了小故障',
      data: { error, errorInfo }
    }
    this.props.setError(showError)
  }

  clearError() {
    this.setState({
      error: null
    })
  }

  render() {
    return this.props.children
  }
}

type IProps = {
  className: string
  children: ReactNode
  useNav?: boolean
  navTitle?: ReactNode
  navClassName?: string
  loading?: any
  h5Nav?: boolean
  tabbar?: boolean
  onReload?: () => Promise<any>
  ignoreError?: boolean
  enablePagePullDownRefresh?: boolean
  renderPageTopHeader?: (navHeight: number, statusBarHeight: number, safeRight: number) => void
}

export default function Index(props: IProps) {
  const { useNav = true, navTitle, navClassName, className, loading, ignoreError, renderPageTopHeader, enablePagePullDownRefresh = true } = props
  const { h5Nav, tabbar, onReload } = props
  const ctx = useContext(UniteContext)
  const [canPull, setCanPull] = useState(true)
  const [springStyles, api] = useSpring(() => ({
    from: { transform: `translateX(-50%) scale(0)`, opacity: 0 },
    config: {
      tension: 300,
      friction: 30,
      clamp: true
    }
  }))
  const [pullDownRefreshStatus, setPullDownRefreshStatus] = useState('pulling') as [
    'pulling' | 'refreshing' | 'complete' | 'canRelease',
    React.Dispatch<React.SetStateAction<'pulling' | 'refreshing' | 'complete' | 'canRelease'>>
  ]

  // 异常来自于三个部分 1: Request Code 2 JSError 3: BoundaryError
  // 有初始数据但是请求接口报错了，则toast。JSError BoundaryError Login 三个直接展示全屏错误
  useEffect(() => {
    if (!loading && ctx.error && ctx.error.code !== 'JSError' && ctx.error.code !== 'BoundaryError' && ctx.error.code !== LOGIN_CODE) {
      if (!ignoreError) {
        showToast({
          title: ctx.error.message,
          icon: 'none'
        })
      }
      ctx.setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.error, loading])

  usePageScroll((e) => {
    if (e.scrollTop > 0 && canPull) {
      setCanPull(false)
    }
    if (e.scrollTop <= 0 && !canPull) {
      setCanPull(true)
    }
  })

  function render() {
    // JSError、 BoundaryError、 没有初始数据并且报错并且不是登录错误  则全屏展示
    if (ctx.error?.code === 'JSError' || ctx.error?.code === 'BoundaryError' || (loading && ctx.error && ctx.error?.code !== LOGIN_CODE)) {
      if (ignoreError) return <></>
      return <Error setError={ctx.setError as any} onRefresh={ctx.onRefresh} error={ctx.error} />
    }
    if (loading) return <Loading />
    return (
      <>
        <PullDownRefresh
          className={className}
          canPull={!!(ctx.uniteConfig.page && enablePagePullDownRefresh && canPull)}
          onRefresh={ctx.onRefresh}
          setStatus={setPullDownRefreshStatus}
          status={pullDownRefreshStatus}
          onReload={onReload}
          api={api}
        >
          <>{props.children}</>
        </PullDownRefresh>
      </>
    )
  }

  return (
    <ErrorBoundary setError={ctx.setError}>
      {ctx.uniteConfig.page ? (
        <Navigation
          homeUrl='pages/index/index'
          navTitle={navTitle}
          navClassName={navClassName}
          useNav={useNav}
          enablePullDownRefresh={enablePagePullDownRefresh}
          pullDownRefreshStatus={pullDownRefreshStatus}
          h5Nav={h5Nav}
          tabbar={tabbar}
          renderHeader={renderPageTopHeader}
          springStyles={springStyles}
        >
          {render()}
        </Navigation>
      ) : (
        render()
      )}
    </ErrorBoundary>
  )
}
