/*
 * @Author: Derek Xu
 * @Date: 2022-09-23 13:46:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-26 17:49:55
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import Container from '@/components/container'
import Header from '@/components/header'
import { View } from '@tarojs/components'
import { ActionSheet, Cell, Dialog, Icon, Loading, Overlay } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { DifferentDay, SameDay } from './ui'
import { userInfoStore, componentRefreshTimeStore } from '@/store'
import { formatAlarmText } from '@/utils'
import { getById, deleteById, queryComponentMemberIds, getAttendStatus, updateAttendStatus, refuseAttend, getShortUrl } from '@/api/component'
import { getName } from '@/api/user'
import { alarmTypeToCode, alarmCodeToType } from '@/utils'
import { IDavComponent } from 'types/calendar'
import { useShareAppMessage } from '@tarojs/taro'
import Images from '@/constants/images'

import { useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'

import './index.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ButtonGroup from '@/components/buttongroup'
import Router from 'tarojs-router-next'

const DEFAULT_ATTEND_BACKGROUD = Images.DEFAULT_ATTEND_BACKGROUD

interface IActions {
  name: string
  value: number
}

export default Unite(
  {
    state: {
      loading: true,
      add: false,
      action: false,
      memberName: '',
      actions: [
        {
          name: '分享二维码',
          value: 0
        },
        {
          name: '编辑',
          value: 2
        },
        {
          name: '删除',
          value: 3
        }
      ],
      id: '',
      color: '',
      summary: '',
      calendarName: '',
      creatorMemberId: '',
      createMemberName: '',
      dtstart: dayjs().toDate(),
      dtend: dayjs().toDate(),
      fullDay: 0,
      repeatStatus: '',
      repeatType: '',
      repeatByday: '',
      repeatBymonth: '',
      repeatBymonthday: '',
      repeatInterval: 0,
      repeatUntil: '',
      memberIds: [],
      alarmType: '',
      alarmTimes: [],
      attendStatus: 0
    },
    async onLoad() {
      const { id, add } = this.location.params
      if (!id) return
      if (add && Boolean(add)) {
        this.setState({
          add: true
        })
      }
      this._init(id)
      if (process.env.TARO_ENV === 'weapp') {
        const _actions: IActions[] = [...[{ name: '分享到朋友圈', value: 1 }], ...this.state.actions]
        _actions.sort((n1, n2) => {
          // return -1; //返回负值 交换顺序
          // return 0 或者 1 //返回正值 保持顺序不变
          console.log(n1, n2)
          return n1.value - n2.value
          // n2 - n1 从大到小
          // n1 - n2 从小到大
        })
        this.setState({
          actions: _actions
        })
      }
    },

    async _init(id: string) {
      this.setState({
        loading: true
      })
      let result
      try {
        result = await Promise.all([getById(id), queryComponentMemberIds(id)])
      } catch (err) {
        this.setState({
          loading: false
        })
        console.log(err)
        return
      }
      if (!result || result.length !== 2) return
      this._setComponent(result[0] as any as IDavComponent, ['11111'])
    },

    setAction(action: boolean) {
      this.setState({
        action
      })
    },

    setActionChoose(e: any) {
      if (!e.value) return
      switch (e.value) {
        case 2:
          this._editComponent()
          break
        case 3:
          this._deleteComponent()
          break
      }
    },

    setAttendStatus(attendStatus: number) {
      this.setState({
        attendStatus
      })
    },

    async _setComponent(component: IDavComponent, memberIds: string[]) {
      this.setState({ ...Object.assign({ ...component, alarmTimes: [] }), memberIds })
      if (component.alarmType) {
        this.setState({
          alarmType: alarmTypeToCode(component.alarmType)
        })
      }
      if (component.alarmTimes) {
        this.setState({
          alarmTimes: component.alarmTimes.split(',')
        })
      }

      // if (component.endTime && dayjs(Number.parseInt(comp.endTime)).isBefore(dayjs())) {
      //   setExpire(true)
      // }
      if (component.creatorMemberId === this.hooks['userInfo'].id) {
        this.setState({
          createMemberName: this.hooks['userInfo'].name,
          loading: false
        })
        return
      }
      try {
        /**加载组织者 */
        if (memberIds.length !== 0) {
          const nameResult = await getName(component.creatorMemberId)
          this.setState({
            createMemberName: nameResult
          })
        }
        const attendStatusResult = await getAttendStatus(component.id)
        this.setState({
          attendStatus: attendStatusResult as any as number
        })
        this.setState({
          loading: false
        })
      } catch (err) {
        console.log(err)
        this.setState({
          loading: false
        })
      }
    },

    _editComponent() {
      Router.toComponentedit({
        params: {
          id: this.state.id
        }
      })
    },

    _deleteComponent() {
      Dialog.confirm({
        title: '删除日程',
        message: '确定删除吗？',
        selector: 'deleteDialog2'
      }).then((value) => {
        if (value === 'cancel') return
        this.setState({
          loading: true
        })
        deleteById(this.state.id)
          .then(() => {
            this._success()
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading: false
            })
            this.hooks['toast']({
              icon: 'error',
              title: '删除失败'
            })
          })
      })
    },

    _success() {
      this.setState({
        loading: false
      })
      this.hooks['toast']({
        title: '删除成功'
      })
      this.hooks['setComponentRefreshTime'](dayjs().valueOf())
      window.setTimeout(() => {
        this.hooks['back']()
      }, 500)
    }
  },
  function ({ state, events }) {
    const {
      loading,
      add,
      action,
      actions,
      id,
      color,
      summary,
      calendarName,
      createMemberName,
      creatorMemberId,
      dtstart,
      dtend,
      fullDay,
      repeatStatus,
      repeatType,
      repeatByday,
      repeatBymonth,
      repeatBymonthday,
      repeatInterval,
      repeatUntil,
      memberIds,
      alarmType,
      alarmTimes,
      attendStatus
    } = state

    const { setAction, setActionChoose, setAttendStatus } = events
    const setComponentRefreshTime = useSetRecoilState(componentRefreshTimeStore)
    const userInfo = useRecoilValue(userInfoStore)
    const [toast] = useToast({
      icon: 'success'
    })
    const [back] = useBack({
      to: add ? 2 : 1
    })
    events.setHooks({
      toast: toast,
      back: back,
      userInfo: userInfo,
      setComponentRefreshTime: setComponentRefreshTime
    })

    useShareAppMessage((res) => {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: summary,
        path: '/pages/componentshareview/index?componentId=' + id,
        imageUrl: DEFAULT_ATTEND_BACKGROUD
      }
    })

    return (
      <Container
        navTitle='日程查看'
        enablePagePullDownRefresh={false}
        className='pages-component-view-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='日程查看' left={true} to={1} delta={add ? 2 : 1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Cell className='summany'>
            <View className='event-label' style={{ color: `#${color}`, background: `#${color}` }}></View>
            <View class='calendar'>
              <View class='margin-left event-calendar'>
                <View className='title'>{summary}</View>
                <View>{calendarName}</View>
              </View>
              <View className='ellipsis' onClick={() => setAction(true)}>
                <Icon name='ellipsis' />
              </View>
            </View>
          </Cell>
          <Cell className='start-time' icon='clock-o'>
            <View className='margin-left event-content'>
              {dayjs(dtstart).isSame(dtend, 'date') ? (
                <SameDay dtstart={dtstart} dtend={dtend} fullDay={fullDay}></SameDay>
              ) : (
                <DifferentDay
                  dtstart={dtstart}
                  dtend={dtend}
                  fullDay={fullDay}
                  repeatStatus={repeatStatus}
                  repeatType={repeatType}
                  repeatByday={repeatByday}
                  repeatBymonth={repeatBymonth}
                  repeatBymonthday={repeatBymonthday}
                  repeatInterval={repeatInterval}
                ></DifferentDay>
              )}
            </View>
          </Cell>
          <View className='divider'></View>
          {memberIds && memberIds.length !== 0 && (
            <>
              <Cell icon='user-o' title='组织者'>
                {createMemberName}
              </Cell>
              <Cell icon='friends-o' title={`共邀请（${memberIds.length}）人`}></Cell>
            </>
          )}
          <View className='divider'></View>
          <Cell className='alarm' icon='bullhorn-o'>
            <View className='event-content'>{formatAlarmText(alarmType, alarmTimes)}</View>
          </Cell>
        </View>
        {creatorMemberId !== userInfo?.id && !loading && (
          <View className='van-page-button'>
            <ButtonGroup
              actived={attendStatus}
              onClick={(e) => setAttendStatus(e)}
              buttons={[
                { name: '待定', value: 0 },
                { name: '接受', value: 1 },
                { name: '拒绝', value: 2 }
              ]}
            ></ButtonGroup>
          </View>
        )}

        <ActionSheet
          show={action}
          actions={actions}
          onSelect={(e) => setActionChoose(e.detail)}
          cancelText='取消'
          onCancel={() => setAction(false)}
          onClose={() => setAction(false)}
        />
        <Overlay show={loading} className='overlay'>
          <Loading type='spinner'>加载中...</Loading>
        </Overlay>
        <Dialog id='deleteDialog2' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
