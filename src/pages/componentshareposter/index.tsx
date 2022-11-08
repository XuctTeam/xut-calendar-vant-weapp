/*
 * @Author: Derek Xu
 * @Date: 2022-09-30 15:24:02
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-08 16:09:38
 * @FilePath: \xut-calendar-vant-weapp\src\pages\componentshareposter\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */

import Taro, { FileSystemManager } from '@tarojs/taro'
import { useRef } from 'react'
import Unite from '@antmjs/unite'
import Container from '@/components/container'
import { Canvas, View } from '@tarojs/components'
import QR from 'qrcode-base64'
import { Button } from '@antmjs/vantui'
import { getShortUrl, getById } from '@/api/component'
import Images from '@/constants/images'
import dayjs from 'dayjs'
import { useToast } from 'taro-hooks'
import { useRecoilValue } from 'recoil'
import { userInfoStore } from '@/store'
import { IDavComponent } from 'types/calendar'
import { formatDifferentDayTime, formateSameDayDuration, formatSameDayTime, useNav } from '@/utils'
import './index.less'

interface IImageOption {
  src: string
}

interface IPackageTimeOption {
  dtstart: Date
  dtend: Date
  fullDay: number
  repeatStatus?: string
  repeatType?: string
  repeatByday?: string
  repeatBymonth?: string
  repeatBymonthday?: string
  repeatInterval?: number
  repeatUntil?: string
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
      this.init(id)
    },

    async init(id: string) {
      const result = await Promise.all([getById(id), getShortUrl(id)])
      if (!(result && result.length === 2)) return
      const component = result[0] as any as IDavComponent
      this._setQrCode(result[1] as any as string, component.summary, { ...component })
    },

    async _setQrCode(url: string, summary: string, packageTime: IPackageTimeOption) {
      const qrCode = QR.drawImg(url, {
        typeNumber: 4,
        errorCorrectLevel: 'M',
        size: 500
      })
      if (process.env.TARO_ENV === 'h5') {
        this._draw(qrCode, summary, packageTime)
        return
      }
      try {
        await this._removeSave()
      } catch (err) {
        console.log(err)
      }
      try {
        this._base64ToSave(qrCode)
          .then((rs) => {
            if (!rs) return
            //@ts-ignore
            this._draw(rs as any as string, summary, packageTime)
          })
          .catch((err) => {
            console.log(err)
            return Promise.reject(err)
          })
      } catch (err) {
        debugger
      }
    },

    _draw(qrCode: string, summary: string, packageTime: IPackageTimeOption) {
      const that = this
      Taro.createSelectorQuery()
        .select('#myCanvas')
        .node((res) => {
          if (!res || !res.node) {
            setTimeout(() => {
              that._draw(qrCode, summary, packageTime)
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
          //ctx.fillStyle = '#ffffff'
          //ctx.fillRect(0, 0, systemInfo.screenWidth, _scrHeight)

          /* 背景图*/
          that._drawRoundedRect(ctx, 'white', '#f4f4f4', 10, 10, _scrWidth, _scrHeight - 20, 5)

          /* 日程详情 */
          that._drawRoundedRect(ctx, 'white', '#a4d1eb', 20, 80, _scrWidth - 20, _scrHeight - 200, 5)

          that._drawTxt({
            context: ctx,
            text: this.hooks['userInfo'].name || '名称',
            fillStyle: '#000000',
            broken: true,
            x: 80,
            y: 30,
            font: '13px sans-serif',
            lineHeight: 18,
            maxWidth: 450,
            maxLine: 2
          })

          that._drawTxt({
            context: ctx,
            text: '给你推荐了日程',
            fillStyle: '#666666',
            broken: true,
            x: 80,
            y: 50,
            font: '10px sans-serif',
            lineHeight: 14,
            maxWidth: 450,
            maxLine: 2
          })

          that._drawTxt({
            context: ctx,
            text: summary,
            fillStyle: '#fff',
            broken: true,
            x: 30,
            y: 100,
            font: '14px sans-serif',
            lineHeight: 20,
            maxWidth: _scrWidth - 40,
            maxLine: 2
          })

          /** 日程时间 */
          that._packageTime(ctx, _scrWidth, packageTime)

          /** 二维码 */
          that._drawTxt({
            context: ctx,
            text: `扫码/长按识别二维码查看详情`,
            fillStyle: '#666666',
            broken: true,
            x: 104,
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
              src: this.hooks['userInfo'].avatar || Images.DEFAULT_AVATAR
            },
            {
              src: Images.DEFAULT_ATTEND_BACKGROUD
            },
            {
              src: qrCode
            }
          )
          // 对Promise.all数组进行图片绘制操作
          imgList.forEach((item, index) => {
            const imgtag = that._getImage(cavs)
            imgtag.src = item.src
            imgtag.crossOrigin = 'Anonymous'

            if (index == 0) {
              imgtag.src += `?timestamp= ${Date.now()}`
              imgtag.onload = () => {
                console.log(imgtag.src)
                this._drawCircleImage(ctx, imgtag, 30, 24, 44)
              }
            } else if (index == 1) {
              imgtag.onload = () => {
                //ctx.drawImage(imgtag, (_scrWidth - 220) / 2, 70, 220, 220)
              }
            } else if (index == 2) {
              imgtag.onload = () => {
                ctx.drawImage(imgtag, 40, _scrHeight - 100, 60, 60)
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

    _drawCircleImage(ctx, img, x, y, width) {
      ctx.save()
      //绘制头像
      ctx.beginPath() //开始绘制
      //先画个圆，前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，			  即顺时针
      ctx.arc(width / 2 + x, width / 2 + y, width / 2, 0, Math.PI * 2, false)
      ctx.clip() //画好了圆 剪切  原始画布中剪切任意形状和尺寸。
      // 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
      ctx.drawImage(img, x, y, width, width)
      // ctx.fill();
      ctx.restore() //恢复之前保存的绘图上下文 恢复之前保存的绘图问下文即状态 还可以继续绘制
      ctx.closePath()
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
    _drawTxt({ context, text = 'test text', fillStyle = '#000', broken = true, ...rest }) {
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

    _drawRoundedRect(ctx, strokeStyle, fillStyle, x, y, width, height, radius) {
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
    },

    _packageTime(ctx: any, scrWidth: number, timeOption: IPackageTimeOption) {
      if (dayjs(timeOption.dtstart).isSame(timeOption.dtend, 'date')) {
        this._drawTxt({
          context: ctx,
          text: formatSameDayTime(timeOption.fullDay, timeOption.dtstart, timeOption.dtend),
          fillStyle: '#fff',
          broken: true,
          x: 30,
          y: 140,
          font: '12px sans-serif',
          lineHeight: 20,
          maxWidth: scrWidth - 40,
          maxLine: 2
        })
        this._drawTxt({
          context: ctx,
          text: formateSameDayDuration(timeOption.fullDay, timeOption.dtstart, timeOption.dtend),
          fillStyle: '#fff',
          broken: true,
          x: 30,
          y: 160,
          font: '12px sans-serif',
          lineHeight: 20,
          maxWidth: scrWidth - 40,
          maxLine: 2
        })
        return
      }
      this._drawTxt({
        context: ctx,
        text: formatDifferentDayTime(1, timeOption.fullDay, timeOption.dtstart),
        fillStyle: '#fff',
        broken: true,
        x: 30,
        y: 140,
        font: '12px sans-serif',
        lineHeight: 20,
        maxWidth: scrWidth - 40,
        maxLine: 2
      })
    },

    _removeSave(FILE_BASE_NAME = 'tmp_base64src', format = 'jpg') {
      return new Promise((resolve) => {
        // 把文件删除后再写进，防止超过最大范围而无法写入
        const fsm = Taro.getFileSystemManager() //文件管理器
        const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
        fsm.unlink({
          filePath: filePath,
          success() {
            console.log('文件删除成功')
            resolve(true)
          },
          fail(e) {
            console.log('readdir文件删除失败：', e)
            resolve(true)
          }
        })
      })
    },

    _base64ToSave(base64data, FILE_BASE_NAME = 'tmp_base64src') {
      const fsm: FileSystemManager = Taro.getFileSystemManager()
      return new Promise((resolve, reject) => {
        //format这个跟base64数据的开头对应
        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
        if (!format) {
          reject(new Error('ERROR_BASE64SRC_PARSE'))
        }
        const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
        //const buffer = wx.base64ToArrayBuffer(bodyData);
        if (!bodyData) return
        fsm.writeFile({
          filePath,
          data: bodyData,
          //data: base64data.split(";base64,")[1],
          encoding: 'base64',
          success() {
            resolve(filePath)
          },
          fail() {
            reject(new Error('ERROR_BASE64SRC_WRITE'))
          }
        })
      })
    },

    saveQrCode() {
      if (!this.hooks['canvasRef'].current) return
      if (process.env.TARO_ENV === 'h5') {
        return this._downH5QRCode()
      }
      this._downWeappQrCode()
    },

    _downH5QRCode() {
      const img = new Image()
      console.log(this.hooks['canvasRef'].current.current)
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = this.hooks['canvasRef'].current.toDataURL('image/png')
      img.onload = function () {
        const link = document.createElement('a')
        link.href = img.src
        link.download = Math.random() + `.png`
        const event = new MouseEvent('click') // 创建一个单击事件
        link.dispatchEvent(event) // 主动触发a标签的click事件下载
      }
    },

    async _downWeappQrCode() {
      const that = this
      Taro.getSetting({
        success: function (res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            Taro.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function () {
                that._weappWritePhotosAlbum()
              }
            })
            return
          }
          that._weappWritePhotosAlbum()
        }
      })
    },

    _weappWritePhotosAlbum() {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 400,
        height: 500,
        destWidth: 360,
        destHeight: 450,
        canvasId: 'myCanvas',
        canvas: this.hooks['canvasRef'].current,
        fileType: 'png'
      })
        .then((res) => {
          console.log(res.tempFilePath)
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath
          })
            .then(() => {
              this.hooks['toast']({ title: '保存成功', icon: 'success' })
            })
            .catch(() => {
              this.hooks['toast']({ title: '图片保存失败' })
              return
            })
        })
        .catch(() => {
          this.hooks['toast']({ title: '生成临时图片失败' })
        })
    }
  },
  function ({ events }) {
    const { saveQrCode } = events
    const systemInfo = Taro.getSystemInfoSync()
    const canvasRef = useRef<any>()
    const userInfo = useRecoilValue(userInfoStore)
    const [toast] = useToast({
      icon: 'error'
    })

    events.setHooks({
      systemInfo: systemInfo,
      canvasRef: canvasRef,
      userInfo: userInfo,
      toast: toast
    })
    const usedNav = useNav()

    return (
      <Container
        navTitle='日程海报分享'
        enablePagePullDownRefresh={false}
        className='pages-component-share-poster-index'
        useNav={usedNav}
        useMenuBtns={usedNav}
      >
        <View className='van-page-box'>
          <Canvas type='2d' id='myCanvas' canvasId='myCanvas' style={{ width: '100%', height: '100%' }}></Canvas>
        </View>
        <View className='van-page-button'>
          <Button block type='danger' onClick={saveQrCode}>
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
