/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-03-01 21:55:42
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-10 09:11:49
 */
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useToast, useFile } from 'taro-hooks'
import { Button, Popup, Uploader } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import { cacheGetSync } from '@/calendar/cache/cache'
import calendar from '@/calendar'
import { IUploadInfo } from '~/../types/common'

interface IPageOption {
  open: boolean
  avatar: string
  close: () => void
  updateAvatar: (avatar: string) => void
}

type IUploadState = 'uploading' | 'failed' | 'done'

interface IFile {
  url: string
  status: IUploadState
  message?: string
}

const UploadHeader: FunctionComponent<IPageOption> = (props) => {
  const [files, setFiles] = useState<IFile[]>([])
  const { show } = useToast({
    icon: 'error'
  })
  const { upload } = useFile()

  useEffect(() => {
    setFiles([
      {
        url: props.avatar,
        status: 'done'
      }
    ])
  }, [props.avatar])

  const afterRead = useCallback(
    async (event: any) => {
      const { file } = event.detail
      // 可在此处新增云上传图片操作
      if (file[0].state === 'uploading') {
        show({ title: '正在上传' })
        return
      }
      if (!(file && file[0])) {
        show({ title: '获取上传文件失败' })
        return
      }
      let _file: IFile = {
        url: file[0].url,
        status: 'uploading'
      }
      setFiles([_file])
      const assessToken = cacheGetSync('accessToken')
      const uploadResult = await upload({
        url: calendar.$api.common.upload(),
        filePath: file[0].url,
        name: 'file',
        header: { Authorization: assessToken }
      })
      if (uploadResult.statusCode !== 200) {
        _uploadFail()
        return
      }
      const result: IUploadInfo = JSON.parse(uploadResult?.data)
      if (!result.success) {
        _uploadFail()
        return
      }
      const { url } = result.data
      _file = {
        url: url,
        status: 'done'
      }
      setFiles([_file])
    },
    [show]
  )

  const deleteAction = (event: any) => {
    const { index } = event.detail
    const valueNew = JSON.parse(JSON.stringify(files))
    valueNew.splice(index, 1)
    setFiles(valueNew)
  }

  const _uploadFail = () => {
    show({ title: '上传失败' })
    const _file: IFile = {
      url: files[0]?.url || '',
      status: 'failed'
    }
    setFiles([_file])
  }

  const updateAvatarHandle = () => {
    if (!(files && files.length !== 0)) {
      show({ title: '上传文件为空' })
      return
    }
    if (files[0]?.status === 'uploading') {
      show({ title: '正在上传' })
      return
    }
    if (files[0] && files[0].url && files[0].url !== props.avatar) {
      props.updateAvatar(files[0].url)
      return
    }
    show({ title: '上传数据重复' })
  }

  return (
    <Popup show={props.open} position='bottom' style={{ height: '30%' }} onClose={props.close}>
      <View className='upload'>
        <Uploader fileList={files} accept='image' multiple maxCount={1} onDelete={deleteAction} onAfterRead={afterRead} />
        <View className='button'>
          <Button type='warning' block onClick={() => updateAvatarHandle()}>
            保存
          </Button>
        </View>
      </View>
    </Popup>
  )
}

export default UploadHeader
