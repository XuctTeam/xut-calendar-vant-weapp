/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-08-15 21:58:13
 * @FilePath: \xut-calendar-vant-weapp\src\pages\addressgroupsearch\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import { useRef } from 'react'
import { Button, Dialog, Search, Unite } from '@antmjs/vantui'
import Pagination from '@/components/pagination'
import { Input, ITouchEvent } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Container from '@/components/container'
import Header from '@/components/header'
import { search } from '@/api/group'
import { ConditionSearch, GroupBody } from './ui'
import { IGroup } from 'types/group'
import { apply } from '@/api/groupmember'

import './index.less'
import { useBack } from '@/utils/taro'
import { useToast } from 'taro-hooks'

const PAGE_SIZE = 50

export default Unite(
  {
    state: {
      value: '',
      show: false,
      list: [],
      complete: false,
      loading: false,
      password: ''
    },

    setValue(value: string) {
      this.setState({
        value
      })
    },

    setShow(show: boolean) {
      this.setState({
        show
      })
    },

    setPassword(password: string) {
      this.setState({
        password
      })
    },

    async loadList(refresh = false) {
      this.setState({
        loading: true
      })
      const result: any = await search(this.state.value, this.hooks['pageRef'].current, PAGE_SIZE)
      const { finished, list } = result
      this.setState({
        complete: finished,
        list: refresh ? list : [].concat(this.state.list).concat(list as any),
        loading: false
      })
      this.hooks['pageRef'].current = this.hooks['pageRef'].current + 1
    },

    onSearch(e: ITouchEvent) {
      console.log(e.detail)
      this.hooks['pageRef'].current = 0
      this.loadList(true)
    },

    onConditionSearch(hasPass: string, dateScope: string, numCount: string) {
      this.setState({
        show: false
      })
      console.log(hasPass, dateScope, numCount)
    },

    onClear() {
      this.hooks['pageRef'].current = 0
      this.setState({
        list: []
      })
    },

    onJoin(id: string, hasPassword: boolean) {
      if (!hasPassword) {
        return this._join(id)
      }
      Dialog.confirm({
        title: '加入密码',
        message: <Input placeholder='请输入密码' value={this.state.password} onInput={(e) => this.setPassword(e.detail.value)} />,
        selector: 'vanDialog0'
      }).then((value) => {
        if (value === 'cancel') return
        console.log('dialog result', this.state.password)
        this._join(id)
      })
    },

    _join(id: string) {
      apply(id, this.state.password)
        .then(() => {
          this.setState({
            password: ''
          })
          this.hooks['toast']({
            title: '加入成功'
          })
          window.setTimeout(() => {
            this.hooks['back']({
              refresh: true
            })
          }, 1500)
        })
        .catch((err: any) => {
          console.log(err)
          this.setState({
            password: ''
          })
        })
    }
  },
  function ({ state, events }) {
    const { value, show, list, complete, loading } = state
    const { setValue, setShow, onSearch, loadList, onJoin, onClear, onConditionSearch } = events
    const pageRef = useRef<number>(0)
    const [toast] = useToast({
      icon: 'success'
    })
    const [back] = useBack({
      to: 2
    })

    events.setHooks({
      pageRef: pageRef,
      toast: toast,
      back: back
    })

    useReachBottom(() => {
      if (!!value && !loading && !complete) {
        loadList()
      }
    })
    return (
      <Container
        navTitle='发现群组'
        h5Nav={true}
        enablePagePullDownRefresh={false}
        className='address-group-search-index'
        renderPageTopHeader={() => {
          return <Header title='发现群组' left to={2}></Header>
        }}
      >
        <Pagination complete={complete} loading={loading} data={list}>
          <Search
            onChange={(e) => setValue(e.detail)}
            placeholder='输入群组名称'
            onSearch={onSearch}
            shape='round'
            clearable
            onClear={onClear}
            renderAction={
              <Button size='small' type='warning' onClick={() => setShow(true)}>
                筛选
              </Button>
            }
          />
          {list?.map((item: IGroup, index: number) => {
            return (
              <GroupBody
                id={item.id}
                key={index}
                name={item.name}
                avatar={item?.images}
                num={item.num}
                count={item.count || 0}
                hasPasword={item.hasPasswordJoin === 1 ? true : false}
                onJoin={onJoin}
              ></GroupBody>
            )
          })}
        </Pagination>
        <ConditionSearch show={show} value={value} onClose={() => setShow(false)} onSearch={onConditionSearch}></ConditionSearch>
        <Dialog id='vanDialog0' />
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: '',
  onReachBottomDistance: 500
})
