/*
 * @Author: Derek Xu
 * @Date: 2022-08-15 13:01:20
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-16 11:11:41
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupsearch\ui\ConditionSearch.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { FC } from 'react'
import { Button, CellGroup, Col, Popup, Radio, RadioGroup, Row } from '@antmjs/vantui'
import { View } from '@tarojs/components'

interface IPageOption {
  value: string
  show: boolean
  hasPass: string
  dateScope: string
  numCount: string
  setHasPass: (hasPass: string) => void
  setDateScope: (dateScope: string) => void
  setNumCount: (numCount: string) => void
  onClose: () => void
  onSearch: () => void
  reset: () => void
}

const ConditionSearch: FC<IPageOption> = (props) => {
  const { hasPass, dateScope, numCount, setHasPass, setDateScope, setNumCount, reset } = props

  return (
    <Popup
      style={{ height: '100%', width: '60%', background: '#fff', display: 'flex', flexDirection: 'column' }}
      show={props.show}
      position='right'
      onClose={props.onClose}
    >
      <View className='pop-box'>
        <CellGroup inset title='密码条件'>
          <RadioGroup value={hasPass} onChange={(e) => setHasPass(e.detail)}>
            <Radio name='1' checkedColor='red'>
              有密码
            </Radio>
            <Radio name='2' checkedColor='red'>
              无密码
            </Radio>
          </RadioGroup>
        </CellGroup>
        <CellGroup inset title='时间范围'>
          <RadioGroup value={dateScope} onChange={(e) => setDateScope(e.detail)}>
            <Radio name='1' checkedColor='red'>
              三天前
            </Radio>
            <Radio name='2' checkedColor='red'>
              一周前
            </Radio>
            <Radio name='3' checkedColor='red'>
              一月前
            </Radio>
            <Radio name='4' checkedColor='red'>
              一年前
            </Radio>
          </RadioGroup>
        </CellGroup>
        <CellGroup inset title='人数'>
          <RadioGroup value={numCount} onChange={(e) => setNumCount(e.detail)}>
            <Radio name='1' checkedColor='red'>
              小于50
            </Radio>
            <Radio name='2' checkedColor='red'>
              大于100
            </Radio>
          </RadioGroup>
        </CellGroup>
      </View>
      <Row gutter={10}>
        <Col span={10}>
          <Button size='small' type='warning' onClick={() => props.onSearch()}>
            查询
          </Button>
        </Col>
        <Col span={10}>
          <Button size='small' type='danger' onClick={reset}>
            重置
          </Button>
        </Col>
      </Row>
    </Popup>
  )
}

export default ConditionSearch
