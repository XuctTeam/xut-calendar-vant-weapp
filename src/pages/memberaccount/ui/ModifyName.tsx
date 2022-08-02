/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2021-12-16 21:32:36
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-01 15:00:14
 */
import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Field, Popup } from '@antmjs/vantui'

type IPageOption = {
  open: boolean
  name: string
  closeHanler: () => void
  modifyNameHandler: (name: string) => void
}

const ModifyName: React.FC<IPageOption> = (props) => {
  const [modifyName, setModifyName] = useState<string>('')

  useEffect(() => {
    setModifyName(props.name)
  }, [props.name])

  return (
    <Popup show={props.open} position='bottom' style={{ height: '30%' }} onClose={props.closeHanler}>
      <View className='vi-user-wrapper_ui-name'>
        <Field label='名称' className='field' placeholder='请输入名称' value={modifyName} onChange={(e) => setModifyName(e.detail.value)}></Field>
        <Button block onClick={() => props.modifyNameHandler(modifyName)}>
          保存
        </Button>
      </View>
    </Popup>
  )
}

export default ModifyName
