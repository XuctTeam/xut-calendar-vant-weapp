/*
 * @Author: Derek Xu
 * @Date: 2022-09-30 15:24:02
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-09-30 17:58:19
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentshareposter\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import Taro from '@tarojs/taro'
import { useRef } from 'react'
import Header from '@/components/header'
import Unite from '@antmjs/unite'
import Container from '@/components/container'
import { Canvas, View } from '@tarojs/components'
import QR from 'qrcode-base64'
import { Button } from '@antmjs/vantui'
import { getShortUrl } from '@/api/component'
import Images from '@/constants/images'

import './index.less'

interface IImageOption {
  src: string
}

export default Unite(
  {
    state: {
      id: '',
      qrCode: ''
    },

    async onLoad() {
      const { id } = this.location.params
      if (!id) return
      this.setState({
        id
      })
      this._getQrcode(id)
    },

    _getQrcode(id: string) {
      getShortUrl(id)
        .then((res) => {
          this._setQrCode(res as any as string)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async _setQrCode(url: string) {
      const qrCode = QR.drawImg(url, {
        typeNumber: 4,
        errorCorrectLevel: 'M',
        size: 500
      })
      this._draw(qrCode)
      // if (webEnv) {
      //   _draw(qrCode)
      // }
      // await _removeSave()
      // _base64ToSave(qrCode)
      //   .then((rs) => {
      //     if (!rs) return
      //     //@ts-ignore
      //     _draw(rs as any as string)
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     return Promise.reject(err)
      //   })
    },

    _draw(qrCode: string) {
      const that = this
      Taro.createSelectorQuery()
        .select('#myCanvas')
        .node((res) => {
          if (!res || !res.node) {
            setTimeout(() => {
              that._draw(qrCode)
            }, 200)
            return
          }
          const { node } = res
          const systemInfo = this.hooks['systemInfo']
          if (!node) return
          this.hooks['canvasRef'].current = node
          const cavs: any = node
          const _scrWidth = systemInfo.screenWidth - 20
          const _scrHeight = 420

          const ctx = cavs.getContext('2d')

          const dpr = systemInfo.pixelRatio
          cavs.width = systemInfo.screenWidth * dpr
          cavs.height = _scrHeight * dpr
          ctx.scale(dpr, dpr)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, systemInfo.screenWidth, _scrHeight)

          that.drawRoundedRect(ctx, 'white', '#ccffff', 10, 10, _scrWidth, _scrHeight - 40, 5)

          // drawTxt({
          //   context: ctx,
          //   text: userInfo.name,
          //   fillStyle: '#000000',
          //   broken: true,
          //   x: 64,
          //   y: 20,
          //   font: '13px sans-serif',
          //   lineHeight: 18,
          //   maxWidth: 450,
          //   maxLine: 2
          // })

          // drawTxt({
          //   context: ctx,
          //   text: '给你推荐了日程',
          //   fillStyle: '#666666',
          //   broken: true,
          //   x: 66,
          //   y: 40,
          //   font: '10px sans-serif',
          //   lineHeight: 14,
          //   maxWidth: 450,
          //   maxLine: 2
          // })

          // drawTxt({
          //   context: ctx,
          //   text: summary,
          //   fillStyle: '#000000',
          //   broken: true,
          //   x: 20,
          //   y: 330,
          //   font: '14px sans-serif',
          //   lineHeight: 20,
          //   maxWidth: 276,
          //   maxLine: 2
          // })

          this.drawTxt({
            context: ctx,
            text: '123123',
            fillStyle: '#000000',
            broken: true,
            x: 20,
            y: 350,
            font: '12px sans-serif',
            lineHeight: 20,
            maxWidth: 276,
            maxLine: 2
          })

          this.drawTxt({
            context: ctx,
            text: `扫码/长按识别二维码查看详情`,
            fillStyle: '#666666',
            broken: true,
            x: 90,
            y: _scrHeight - 100,
            font: '12px sans-serif',
            lineHeight: 17,
            maxWidth: 116,
            maxLine: 2
          })

          // 将要绘制的图片放在一个数组中
          let imgList: IImageOption[] = []
          imgList.push(
            {
              src: Images.DEFAULT_AVATAR
            },
            {
              src: Images.DEFAULT_ATTEND_BACKGROUD
            },
            {
              src: this.state.qrCode
            }
          )
          // 对Promise.all数组进行图片绘制操作
          imgList.forEach((item, index) => {
            const imgtag = that._getImage(cavs)
            imgtag.src = item.src
            imgtag.crossOrigin = 'Anonymous'

            if (index == 0) {
              imgtag.onload = () => {
                ctx.drawImage(imgtag, 40, 30, _scrWidth - 100, (_scrWidth - 100) * 0.8)
              }
            } else if (index == 1) {
              imgtag.onload = () => {
                ctx.drawImage(imgtag, (_scrWidth - 220) / 2, 70, 220, 220)
              }
            } else if (index == 2) {
              imgtag.onload = () => {
                ctx.drawImage(imgtag, 20, _scrHeight - 100, 56, 56)
              }
            }
          })
          ctx.restore()
        })
        .exec()
    },

    _getImage(cavs: any) {
      if (process.env.TARO_ENV === 'h5') {
        return new Image()
      }
      return cavs.createImage()
    },

    /*方法说明
     *@method drawTxt
     *@param context canvas上下文
     *@param text 绘制的文字
     *@param fillStyle 字体样式
     *@param broken 用来控制中英文截断
     *@param x 绘制文字的x坐标
     *@param y 绘制文字的y坐标
     *@param font 字体的大小和种类等
     *@param lineHeight 行高/换行高度
     *@param maxWidth 一行最长长度
     *@param maxLine 最多显示行数
     */
    drawTxt({ context, text = 'test text', fillStyle = '#000', broken = true, ...rest }) {
      if (!context) throw Error('请传入绘制上下文环境context')
      // 默认设置
      let origin = { x: 0, y: 0, lineHeight: 30, maxWidth: 630, font: 28, maxLine: 2 }

      // 获取最后的数据
      let { x, y, font, lineHeight, maxWidth, maxLine } = { ...origin, ...rest }

      // 设置字体样式
      context.textAlign = 'left'
      context.textBaseline = 'middle' // 没有好的方法控制行高，所以设置绘制文本时的基线为em 方框的正中
      context.fillStyle = fillStyle
      context.font = font

      // broken: true  如果不考虑英文单词的完整性 适用于所有情况
      // broken: false  考虑英文单词的完整性 仅适用于纯英文
      //【TODO: 中英混排且考虑单词截断...】

      let splitChar = broken ? '' : ' '

      let arrText = text.split(splitChar)
      let line = ''
      let linesCount = 0

      y = y + lineHeight / 2 // 配合context.textBaseline将文字至于中间部分
      for (var n = 0; n < arrText.length; n++) {
        let testLine = line + arrText[n] + splitChar
        let testWidth = context.measureText(testLine).width
        if (testWidth > maxWidth && n > 0) {
          if (linesCount < maxLine) {
            // 判断行数在限制行数内绘制文字
            linesCount++
            context.fillText(line, x, y)
            line = arrText[n] + splitChar
            y += lineHeight
          }
        } else {
          // 一行还未绘制完成
          line = testLine
        }
      }
      context.fillText(line, x, y)
    },

    drawRoundedRect(ctx, strokeStyle, fillStyle, x, y, width, height, radius) {
      ctx.beginPath()
      this._roundedRect(ctx, x, y, width, height, radius)
      ctx.strokeStyle = strokeStyle
      ctx.fillStyle = fillStyle
      ctx.stroke()
      ctx.fill()
    },

    _roundedRect(ctx, x, y, width, height, radius) {
      if (width <= 0 || height <= 0) {
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        return
      }
      ctx.moveTo(x + radius, y)
      ctx.arcTo(x + width, y, x + width, y + height, radius)
      ctx.arcTo(x + width, y + height, x, y + height, radius)
      ctx.arcTo(x, y + height, x, y, radius)
      ctx.arcTo(x, y, x + radius, y, radius)
    }
  },
  function ({ state, events }) {
    const systemInfo = Taro.getSystemInfoSync()
    const canvasRef = useRef<any>()

    events.setHooks({
      systemInfo: systemInfo,
      canvasRef: canvasRef
    })

    return (
      <Container
        navTitle='日程海报分享'
        enablePagePullDownRefresh={true}
        className='pages-component-share-poster-index'
        h5Nav={true}
        useNav={true}
        renderPageTopHeader={() => {
          return <Header title='日程海报分享' left={true} to={1}></Header>
        }}
      >
        <View className='van-page-box'>
          <Canvas type='2d' id='myCanvas' canvasId='myCanvas' style={{ width: '100%', height: '100%' }}></Canvas>
        </View>
        <View className='van-page-button'>
          <Button block type='danger'>
            保存图片
          </Button>
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
