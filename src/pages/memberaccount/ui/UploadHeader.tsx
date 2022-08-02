/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-03-01 21:55:42
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-01 20:31:43
 */
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useToast, useImage, useFile } from 'taro-hooks'
import { Button, Popup, Uploader } from '@antmjs/vantui'
import { cacheGetSync } from '@/cache'
import { upload as uploadPath } from '@/api/common'
import { IUploadInfo } from '~/../@types/common'

import { View } from '@tarojs/components'

interface IPageOption {
  open: boolean
  avatar: string
  close: () => void
  updateAvatar: (avatar: string) => void
}

interface IFile {
  url: string
  status: 'uploading' | 'failed' | 'done'
  message?: string
}

const UploadHeader: FunctionComponent<IPageOption> = (props) => {
  const [files, setFiles] = useState<IFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [toast] = useToast({
    icon: 'error'
  })
  const { upload } = useFile()
  const [, { choose }] = useImage({})

  useEffect(() => {
    setFiles([
      {
        url: props.avatar,
        status: 'done'
      }
    ])
  }, [props.avatar])

  // const onUpload = async () => {
  //   if (loading) {
  //     //toast({ title: '正在上传' })
  //     return
  //   }
  //   const assessToken = cacheGetSync('accessToken')
  //   const fileInfo = await choose()
  //   if (fileInfo?.tempFilePaths?.length) {
  //     const updateFile = fileInfo.tempFiles[0]
  //     const uploadFilePath = fileInfo.tempFilePaths[0]
  //     setFiles([
  //       {
  //         type: updateFile.type,
  //         url: uploadFilePath
  //       }
  //     ])
  //     setLoading(true)
  //     const uploadResult = await upload({
  //       url: uploadPath(),
  //       filePath: uploadFilePath,
  //       name: 'smfile',
  //       header: { Authorization: assessToken }
  //     })
  //     if (uploadResult?.statusCode !== 200) {
  //       _uploadFail()
  //       return
  //     }
  //     const result: IUploadInfo = JSON.parse(uploadResult?.data)
  //     if (!result.success) {
  //       _uploadFail()
  //       return
  //     }
  //     setLoading(false)
  //     setFiles([
  //       {
  //         type: updateFile.type,
  //         url: result.data.url
  //       }
  //     ])
  //   }
  // }

  const afterRead = useCallback(
    async (event: any) => {
      const { file, name } = event.detail
      // 可在此处新增云上传图片操作
      if (loading) {
        toast({ title: '正在上传' })
        return
      }
      const assessToken = cacheGetSync('accessToken')
      console.log(file)
      setLoading(true)
      upload({
        url: uploadPath(),
        filePath: file.url.concat(name),
        name: 'smfile',
        header: { Authorization: assessToken }
      }).then((res) => {
        if (res.statusCode !== 200) {
          _uploadFail()
          return
        }
        const result: IUploadInfo = JSON.parse(res?.data)
        if (!result.success) {
          _uploadFail()
          return
        }
        setLoading(false)
        file['status'] = 'done'
        setFiles(files.concat(file))
      })
      // if (uploadResult?.statusCode !== 200) {
      //   _uploadFail()
      //   return
      // }
      // const result: IUploadInfo = JSON.parse(uploadResult?.data)
      // if (!result.success) {
      //   _uploadFail()
      //   return
      // }
      // setLoading(false)
      // file['status'] = 'done'
      // setFiles(files.concat(file))
    },
    [toast]
  )

  const deleteAction = (event: any) => {
    const { index } = event.detail
    const valueNew = JSON.parse(JSON.stringify(files))
    valueNew.splice(index, 1)
    setFiles(valueNew)
  }

  const _uploadFail = () => {
    toast({ title: '上传失败' })
    setLoading(false)
  }

  const updateAvatarHandle = () => {
    if (loading) {
      //toast({ title: '正在上传' })
      return
    }
    if (files[0] && files[0].url && files[0].url !== props.avatar) {
      props.updateAvatar(files[0].url)
      return
    }
    //toast({ title: '上传数据重复' })
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
