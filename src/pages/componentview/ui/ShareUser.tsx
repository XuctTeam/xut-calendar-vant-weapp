/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-01-28 16:13:36
 * @LastEditTime: 2022-09-23 14:01:07
 * @LastEditors: Derek Xu
 */
import { ShareSheet } from '@antmjs/vantui'
import { FunctionComponent } from 'react'

interface IPageOption {
  open: boolean
  selected: (event: string) => void
  close: () => void
}

const ShareUser: FunctionComponent<IPageOption> = (props) => {
  const { open } = props
  const options = [
    {
      name: '微信',
      icon: 'wechat',
      openType: 'share'
    },
    {
      name: '复制链接',
      icon: 'link'
    },
    {
      name: '二维码',
      icon: 'qrcode'
    }
  ]

  return <ShareSheet show={open} title='立即分享给好友' options={options} onSelect={(e) => props.selected(e.detail.name)} onClose={() => props.close()} />
}

export default ShareUser
