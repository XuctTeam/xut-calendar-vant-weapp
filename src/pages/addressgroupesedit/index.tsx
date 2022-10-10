/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-10-10 11:59:31
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupesedit\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { Button, CellGroup, Form, FormItem, Switch, Toast, Uploader } from '@antmjs/vantui'
import { Input, ITouchEvent, View } from '@tarojs/components'
import Container from '@/components/container'
import { IFormInstanceAPI } from '@antmjs/vantui/types/form'
import { addGroup, getGroupInfo } from '@/api/group'
import { cacheGetSync } from '@/cache'
import { IUploadInfo } from 'types/common'
import { upload as uploadPath } from '@/api/common'
import { IGroup } from 'types/group'
import { useFile, useToast } from 'taro-hooks'
import { useBack } from '@/utils/taro'
import './index.less'
import { useNav } from '@/utils'

export default Unite(
  {
    state: {
      loading: false
    },

    async onLoad() {
      const { id } = this.location.params
      if (!!id) {
        this._init(id || '')
      }
    },

    _init(id: string) {
      getGroupInfo(id).then((res) => {
        const { name, power, password, num, images } = res as any as IGroup
        this.hooks['form'].setFields({
          name: name,
          password,
          power: 'PUBLIC' === power,
          num,
          file: images
            ? [
                {
                  url: images,
                  type: 'image',
                  edit: true
                }
              ]
            : []
        })
      })
    },

    valueFormatUpload(event: any, formName: any, instance: IFormInstanceAPI) {
      Toast.loading('上传中...')
      const { file } = event.detail
      let fileList = instance.getFieldValue(formName) || []
      fileList = fileList.concat(file)
      // 异步更新
      return new Promise((resolve) => {
        setTimeout(() => {
          Toast.clear()
          resolve(fileList)
        }, 2000)
      })
    },

    deleteFile(event: ITouchEvent) {
      const { index, fileList } = event.detail
      fileList.splice(index, 1)
      this.hooks['form'].setFieldsValue('file', fileList)
    },

    async saveOrUpdate() {
      this.hooks['form'].validateFields((errorMessage: any, fieldValues: any) => {
        if (errorMessage && errorMessage.length) {
          return console.info('errorMessage', errorMessage)
        }
        this._save(fieldValues)
      })
    },

    async _save(fieldValues: any) {
      const url = uploadPath()
      this.setState({
        loading: true
      })
      const { file } = fieldValues
      if (!file) {
        this._addForm(fieldValues)
        return
      }
      if (!(file && file.length !== 0)) {
        this._addForm(fieldValues)
        return
      }
      const { edit } = file[0]
      if (edit) {
        fieldValues['url'] = file[0].url
        this._addForm(fieldValues)
        return
      }
      const uploadResult = await this.hooks['upload']({
        url,
        filePath: file[0].url,
        name: 'smsfile',
        header: { Authorization: cacheGetSync('accessToken') }
      })
      if (uploadResult?.statusCode !== 200) {
        this._uploadFail()
        return
      }
      const result: IUploadInfo = JSON.parse(uploadResult?.data)
      if (!result.success) {
        this._uploadFail()
        return
      }
      fieldValues['url'] = result.data.url
      this._addForm(fieldValues)
    },

    _addForm(fieldValues: any) {
      const { id } = this.location.params
      const { name, num, password, power, url } = fieldValues

      addGroup(id || '', name, url, password, power ? 'PUBLIC' : 'PRIVATE', num).then(() => {
        this.setState({
          loading: false
        })
        this.hooks['toast']({
          title: '保存成功',
          icon: 'success'
        })
        window.setTimeout(() => {
          this.hooks['back']({ to: 2, data: { edit: true } })
        }, 1500)
      })
    },

    _uploadFail() {
      this.hooks['toast']({ title: '上传图片失败' })
      this.setState({
        loading: false
      })
    }
  },

  function ({ state, events }) {
    const form = Form.useForm()
    const { loading } = state
    const { valueFormatUpload, deleteFile, saveOrUpdate } = events
    const { upload } = useFile()
    const usedNav = useNav()
    const [toast] = useToast({
      icon: 'error'
    })
    const [back] = useBack({
      to: 2
    })
    events.setHooks({
      form: form,
      toast: toast,
      back: back,
      upload: upload
    })

    return (
      <Container navTitle='群组编辑' enablePagePullDownRefresh={false} className='pages-address-groupesedit-index' useNav={usedNav} showMenuBtns={usedNav}>
        <Form form={form} className='van-page-box'>
          <CellGroup inset>
            <FormItem
              name='file'
              layout='vertical'
              mutiLevel
              className='van-upload-form-item'
              label='上传图片(图片大小不得大于 0.1M)'
              valueKey='fileList'
              valueFormat={valueFormatUpload}
              trigger='onAfterRead'
              validateTrigger='onAfterRead'
              rules={[
                {
                  rule: (values: any, call: any) => {
                    values.forEach((item: any, index: number) => {
                      if (item.size > 1 * 1024 * 1024) {
                        return call(`图片(${index + 1})大小不得大于 0.1M`)
                      }
                      call(null)
                    })
                  }
                }
              ]}
            >
              <Uploader name='file1' maxCount={1} onDelete={deleteFile}></Uploader>
            </FormItem>
            <FormItem
              label='名称'
              name='name'
              required
              trigger='onInput'
              validateTrigger='onBlur'
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='请输入名称' />
            </FormItem>
            <FormItem
              name='num'
              label='人数'
              required
              rules={[
                {
                  rule: (val: any, call: any) => {
                    if (!(val <= 200 && val >= 2)) {
                      return call('最大200最小2')
                    }
                    call(null)
                  }
                }
              ]}
              trigger='onInput'
              validateTrigger='onBlur'
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='请输入人数' type='number' />
            </FormItem>
            <FormItem
              label='口令'
              name='password'
              rules={[{ rule: /^\d{6,9}$/, message: '整数且6-9位' }]}
              trigger='onInput'
              validateTrigger='onBlur'
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder='请输入口令' maxlength={8} />
            </FormItem>
            <FormItem label='允许搜索' name='power' valueKey='checked'>
              <Switch activeColor='#07c160' inactiveColor='#07c160' />
            </FormItem>
          </CellGroup>
        </Form>
        <View className='van-page-button'>
          <Button type='info' block loading={loading} onClick={saveOrUpdate}>
            保存
          </Button>
        </View>
        <Toast id='address-group-edit-loading' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
