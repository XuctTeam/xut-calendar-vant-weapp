/*
 * @Author: Derek Xu
 * @Date: 2022-08-08 21:51:08
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-09 20:53:35
 * @FilePath: \xut-calendar-vant-weapp\src\components\fullScreen\error\index.tsx
 * @Description:
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { View } from '@tarojs/components'
import { Button, Empty } from '@antmjs/vantui'
import './index.less'
interface IProps {
  error: {
    code: string
    message: string
    data?: any
  }
  onRefresh: () => void
  setError: React.Dispatch<
    | React.SetStateAction<{
        code: string
        message: string
        data?: any
      }>
    | undefined
  >
}

export default function Index(props: IProps) {
  const { error, onRefresh, setError } = props

  const clearError = async function () {
    setError(undefined)
    onRefresh()
  }

  return (
    <View className='components-fullScreen-error'>
      <Empty image='error' description={`【${error?.code}】${error?.message}`}>
        <Button className='button' round type='primary' onClick={clearError}>
          刷新
        </Button>
      </Empty>
    </View>
  )
}
