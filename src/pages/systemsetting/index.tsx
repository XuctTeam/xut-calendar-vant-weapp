/*
 * @Author: Derek Xu
 * @Date: 2022-08-01 09:57:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-10 13:24:55
 * @FilePath: \xut-calendar-vant-weapp\src\pages\systemsetting\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Taro from '@tarojs/taro'
import { useRecoilState } from 'recoil'
import { ActionSheet, Cell, CellGroup, Switch } from '@antmjs/vantui'
import Container from '@/components/container'
import { lunarStore, mondayStore, compViewStore } from '@/store'

import './index.less'
import { useNav } from '@/utils'

export default Unite(
  {
    state: {
      viewPicker: false,
      mondayPicker: false
    },
    async onLoad() {},

    getVersion() {
      return process.env.DEPLOY_VERSION
    },

    setViewPicker(viewPicker: boolean) {
      this.setState({
        viewPicker
      })
    },

    setMondayPicker(mondayPicker: boolean) {
      this.setState({
        mondayPicker
      })
    },

    permissionClick() {
      Taro.openSetting({
        success: function (res) {
          console.log(res.authSetting)
        }
      })
    }
  },
  function ({ state, events }) {
    const { viewPicker, mondayPicker } = state
    const { setViewPicker, setMondayPicker, permissionClick, getVersion } = events
    const [lunar, setLunar] = useRecoilState(lunarStore)
    const [monday, setMonday] = useRecoilState(mondayStore)
    const [compView, setCompView] = useRecoilState(compViewStore)
    const usedNav = useNav()

    console.log(getVersion())
    return (
      <>
        <Container navTitle='设置' enablePagePullDownRefresh={true} useNav={usedNav} showMenuBtns={usedNav} className='pages-systemsetting-index'>
          <CellGroup title='日历设置'>
            <Cell title='切换视图' clickable onClick={() => setViewPicker(true)} value={compView === 'list' ? '列表视图' : '日视图'} />
            <Cell title='显示农历'>
              <Switch checked={lunar} onChange={(e) => setLunar(e.detail)}></Switch>
            </Cell>
            <Cell title='星期开始于' clickable onClick={() => setMondayPicker(true)} value={monday ? '周一' : '周日'}></Cell>
          </CellGroup>
          <CellGroup title='系统设置'>
            {process.env.TARO_ENV === 'weapp' && <Cell title='权限管理' clickable onClick={permissionClick}></Cell>}
            <Cell title='关于我们' clickable isLink url='/pages/aboutus/index' linkType='navigateTo'>
              {'V' + getVersion()}
            </Cell>
          </CellGroup>
        </Container>
        <ActionSheet
          onSelect={(e) => {
            setCompView(e.detail.color)
            setViewPicker(false)
          }}
          show={viewPicker}
          actions={[
            {
              name: '列表视图',
              color: 'list'
            },
            {
              name: '日视图',
              color: 'day'
            }
          ]}
          onClose={() => setViewPicker(false)}
        />
        <ActionSheet
          round
          onSelect={(e) => {
            setMonday(e.detail.color === '1')
            setMondayPicker(false)
          }}
          show={mondayPicker}
          actions={[
            {
              name: '周一',
              color: '1'
            },
            {
              name: '周日',
              color: '0'
            }
          ]}
          onClose={() => setMondayPicker(false)}
        />
      </>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
