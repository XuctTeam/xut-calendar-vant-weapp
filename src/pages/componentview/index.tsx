/*
 * @Author: Derek Xu
 * @Date: 2022-09-23 13:46:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 09:04:38
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentview\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Taro from '@tarojs/taro'
import Unite from '@antmjs/unite'
import { View } from '@tarojs/components'
import { ActionSheet, Cell, Dialog, Icon } from '@antmjs/vantui'
import dayjs from 'dayjs'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Router from 'tarojs-router-next'
import { useShareAppMessage } from '@tarojs/taro'
import { useToast } from 'taro-hooks'
import { formatSameDayTime, formateSameDayDuration, formatDifferentDayTime, alarmTypeToCode, formatAlarmText } from '@/calendar/utils'
import Images from '@/calendar/constants/images'

import ButtonGroup from '@/components/buttongroup'
import Container from '@/components/container'
import calendar from '@/calendar'
import { IDavComponent } from 'types/calendar'
import { DifferentDay, SameDay } from './ui'

import './index.less'

const DEFAULT_ATTEND_BACKGROUD = Images.DEFAULT_ATTEND_BACKGROUD

export default Unite(
  {
    state: {
      loading: true,
      action: false,
      memberName: '',
      actions: [
        {
          name: '分享链接',
          value: 1
        },
        {
          name: '分享二维码',
          value: 2
        },
        {
          name: '编辑',
          value: 4
        },
        {
          name: '删除',
          value: 5
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
      attendStatus: 0,
      from: '0' /** 1.首页点击 2.新增后 3.搜索 */
    },
    async onLoad() {
      const { id, from } = this.location.params
      if (!id) return
      if (from) {
        this.setState({
          from
        })
      }
      this._init(id)
    },

    async _init(id: string) {
      this.setState({
        loading: true
      })
      let result
      try {
        result = await Promise.all([calendar.$api.component.getById(id), calendar.$api.component.queryComponentMembers('', id)])
      } catch (err) {
        this.setState({
          loading: false
        })
        console.log(err)
        return
      }
      if (!result || result.length !== 2) return
      this._setComponent(result[0] as any as IDavComponent, result[1] as any as string[])
    },

    setAction(action: boolean) {
      this.setState({
        action
      })
    },

    setActionChoose(e: any) {
      if (!e.value) return
      switch (e.value) {
        case 1:
          this._copyLink()
          break
        case 2:
          this._viewSharePoster()
          break
        case 4:
          this._editComponent()
          break
        case 5:
          this._deleteComponent()
          break
        case 3:
      }
    },

    setAttendStatus(attendStatus: number) {
      if (attendStatus === this.state.attendStatus) return
      this.setState({
        attendStatus
      })

      calendar.$api.component
        .updateAttendStatus(this.state.id, attendStatus)
        .then(() => {})
        .catch((err) => {
          console.log(err)
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

      if (component.creatorMemberId !== this.hooks['userInfo'].id) {
        /* 邀请者不可以编辑事件 */
        this.setState({
          actions: this.state.actions.filter((i) => i.value !== 4)
        })

        try {
          /**加载组织者 */
          if (memberIds.length !== 0) {
            const nameResult = await calendar.$api.user.getName(component.creatorMemberId)
            this.setState({
              createMemberName: nameResult
            })
          }
          const attendStatusResult = await calendar.$api.component.getAttendStatus(component.id)
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
        return
      }

      // if (component.endTime && dayjs(Number.parseInt(comp.endTime)).isBefore(dayjs())) {
      //   setExpire(true)
      // }
      this.setState({
        createMemberName: this.hooks['userInfo'].name,
        loading: false
      })
      return
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
        title: '提示',
        message: '确定删除吗？',
        selector: 'deleteDialog2'
      }).then((value) => {
        if (value === 'cancel') return
        this.setState({
          loading: true
        })
        calendar.$api.component
          .deleteById(this.state.id)
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

    _copyLink() {
      const that = this
      this._shareTitle()
        .then((res) => {
          Taro.setClipboardData({
            data: res as any as string,
            success: function () {
              that.hooks['toast']({
                title: '复制成功！'
              })
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    _shareTitle() {
      const array = [
        {
          title: '【楚日历】',
          value: '日程邀请'
        },
        {
          title: '标题',
          value: this.state.summary
        },
        {
          title: '时间',
          value: dayjs(this.state.dtstart).isSame(this.state.dtend, 'date')
            ? formatSameDayTime(this.state.fullDay, this.state.dtstart, this.state.dtend) +
              ' ' +
              formateSameDayDuration(this.state.fullDay, this.state.dtstart, this.state.dtend)
            : formatDifferentDayTime(1, this.state.fullDay, this.state.dtstart) + '\r' + formatDifferentDayTime(2, this.state.fullDay, this.state.dtend)
        }
      ]
      return new Promise((resolve, reject) => {
        calendar.$api.component
          .getShortUrl(this.state.id)
          .then((res) => {
            array.push({
              title: '点击加入',
              value: res as any as string
            })
            return resolve(`${array.map((item) => `${item.title}: ${item.value}`).join('\n')}`)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    _viewSharePoster() {
      Router.toComponentshareposter({
        params: {
          id: this.state.id
        }
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
        this.hooks['back']({
          data: {
            isRemove: true
          }
        })
      }, 500)
    }
  },
  function ({ state, events }) {
    const {
      loading,
      action,
      from,
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
    const setComponentRefreshTime = useSetRecoilState(calendar.$store.componentRefreshTimeStore)
    const userInfo = useRecoilValue(calendar.$store.userInfoStore)
    const back = calendar.$hooks.useBack({ to: from === '2' ? 2 : 1 })
    const usedNav = calendar.$hooks.useNav()
    const { show } = useToast({
      icon: 'success'
    })

    events.setHooks({
      toast: show,
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
        useNav={usedNav}
        useMenuBtns={usedNav}
        loading={loading}
      >
        <View className='van-page-box'>
          <Cell className='summany'>
            <View className='event-label' style={{ color: `#${color}`, background: `#${color}` }}></View>
            <View className='calendar'>
              <View className='margin-left event-calendar'>
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
                <SameDay
                  dtstart={dtstart}
                  dtend={dtend}
                  fullDay={fullDay}
                  repeatStatus={repeatStatus}
                  repeatType={repeatType}
                  repeatByday={repeatByday}
                  repeatBymonth={repeatBymonth}
                  repeatBymonthday={repeatBymonthday}
                  repeatInterval={repeatInterval}
                  repeatUntil={repeatUntil}
                ></SameDay>
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
                  repeatUntil={repeatUntil}
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
              <Cell
                icon='friends-o'
                clickable
                title={`共邀请（${memberIds.length}）人`}
                onClick={() =>
                  Router.toComponentattend({
                    params: {
                      id
                    }
                  })
                }
              ></Cell>
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
        <Dialog id='deleteDialog2' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '',
  enableShareAppMessage: true
})
