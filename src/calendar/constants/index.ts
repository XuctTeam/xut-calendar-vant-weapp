/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-10 13:38:16
 * @LastEditTime: 2022-11-07 18:28:37
 * @LastEditors: Derek Xu
 */
export const colors = [
  {
    id: '2',
    code: 'red',
    value: 'ee0a24'
  },
  {
    id: '3',
    code: 'green',
    value: '2eb82e'
  },
  {
    id: '4',
    code: 'yellow',
    value: 'ffaa00'
  },
  {
    id: '5',
    code: 'blue',
    value: '3399ff'
  },
  {
    id: '6',
    code: 'brown',
    value: '990000'
  },
  {
    id: '7',
    code: 'purple',
    value: 'bb33ff'
  },
  {
    id: '8',
    code: 'darkblue',
    value: '3366cc'
  },
  {
    id: '9',
    code: 'darkyellow',
    value: 'c68c53'
  },
  {
    id: '10',
    code: 'darkgreen',
    value: '006600'
  },
  {
    id: '11',
    code: 'pink',
    value: 'ff99dd'
  }
]

export const alarmTimeTypes = [
  {
    value: '15',
    text: '15分'
  },
  {
    value: '30',
    text: '30分'
  },
  {
    value: '60',
    text: '1小时'
  },
  {
    value: '1440',
    text: '1天'
  }
]

export const alarmTypes = [
  {
    value: '0',
    text: '不提醒'
  },
  {
    value: '1',
    text: '站内信'
  },
  {
    value: '2',
    text: '邮箱'
  },
  {
    value: '3',
    text: '公众号'
  }
]

export const IndexList = (): string[] => {
  const indexList: string[] = []
  const charCodeOfA = 'A'.charCodeAt(0)
  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i))
  }
  indexList.push('#')
  return indexList
}

export const ENCRYPTION_CODE = 'thanks,pig4cloud'

export const LOGIN_CODE = '206'
