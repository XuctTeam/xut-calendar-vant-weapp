/*
 * @Author: Derek Xu
 * @Date: 2023-10-10 09:27:12
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-19 13:32:29
 * @FilePath: \xut-calendar-vant-weapp\src\calendar\api\interface\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
export namespace Login {
  export interface LoginResult {
    access_token: string
    client_id: string
    refresh_token: string
    user_name: string
    user_id: string
  }
}

export namespace User {
  export interface IUserInfo {
    id: string
    name: string
    avatar?: string
    timeZone: string
    organization: string
  }

  export interface IUserAuth {
    memberId: string
    username: string
    nickName: string
    avatar: string
    identityType: string
  }
}

export namespace Calendar {
  export interface IDavCalendar {
    id: string
    name: string
    color: string
    major: number
    display: number
    checked: boolean
    memberId: string
    calendarId: string
    createMemberId: string
    createMemberName: string
    description: string
    isShare: number
    alarmTime: number
    alarmType: string
  }

  export interface IDavComponent {
    id: string
    calendarId: string
    creatorMemberId: string
    status: string
    summary: string
    location: string
    description: string
    dtstart: Date
    dtend: Date
    startTime?: string
    endTime?: string
    alarmType: string
    alarmTimes?: string
    fullDay: number
    color?: string
    calendarName?: string
    repeatStatus?: string
    repeatType?: string
    repeatByday?: string
    repeatBymonth?: string
    repeatBymonthday?: string
    repeatInterval?: number
    repeatUntil?: string
    memberIds?: string[]
    attendStatus: number
  }

  export interface ICalendarComponent {
    day: string
    calendarId: string
    components: Array<IDavComponent>
  }

  /**
   * 日程分页查询对象
   */
  export interface ICalendarPageComponent {
    finished: boolean
    components: Array<IDavComponent>
  }

  export interface IDvaCalendarProps {
    calendar: {
      calendars: IDavCalendar[]
    }
  }

  export interface IDvaComponentProps {
    component: {
      refreshTime: number
    }
  }
}

export namespace Group {
  export interface IGroup {
    id?: string
    name: string
    no?: string
    createTime: Date
    images?: string
    password?: string
    count?: number
    num: number
    createMemberId: string
    createMemberName?: string
    power: string
    hasPasswordJoin: number
  }

  /**
   * 通讯录人
   */
  export type TMember = {
    id: string
    name: string
    avatar: string
    memberId: string
  }

  /**
   *  群组通讯录
   */
  export interface IGroupMember extends TMember {
    groupId: string
    groupName: string
    groupCreateMemberId?: string
    groupCreateMemberName?: string
    createTime: Date
  }

  /**
   *  选择通讯通人员
   */
  export interface ICheckGroupMember extends TMember {
    checked: boolean
  }

  /**
   * 按拼音分组
   */
  export interface IPinYinGroupMember {
    charCode: string
    members: Array<IGroupMember>
  }

  /**
   * 分页组
   */
  export interface IPageGroup {
    list: Array<IGroup>
    finished: boolean
  }
}
