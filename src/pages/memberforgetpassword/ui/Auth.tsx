/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-27 03:47:42
 * @LastEditTime: 2022-10-26 18:11:40
 * @LastEditors: Derek Xu
 */
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import { checkMobile, checkEmail } from '@/utils'
import { Button, CellGroup, Field } from '@antmjs/vantui'
import { sendForgetSmsCode, sendForgetEmailCode } from '@/api/forget'
import { create } from '@/utils/countdown'

interface IPageOption {
  checkMemberCode: (phone: string, mail: string, code: string, form: number) => void
}

const Auth: FunctionComponent<IPageOption> = (props) => {
  const [phoneSmsText, setPhoneSmsText] = useState<string>('发送验证码')
  const [phoneDisable, setPhoneDisable] = useState<boolean>(false)
  const [phoneForm, setPhoneForm] = useState<boolean>(true)
  const [phone, setPhone] = useState<string>('')
  const [phoneSmsCode, setPhoneSmsCode] = useState<string>('')
  const [mail, setMail] = useState('')
  const [emailSmsCode, setEmailSmsCode] = useState<string>('')
  const [emailSmsText, setEmailSmsText] = useState('发送验证码')
  const [emailDisable, setEmailDisable] = useState<boolean>(false)

  const countDownRef = useRef<any>()

  const [toast] = useToast({
    icon: 'error'
  })

  useEffect(() => {
    countDownRef.current = create(
      Date.now() + 1000 * 100,
      ({ d, h, m, s }) => {
        console.log(`${d}天${h}时${m}分${s}秒`)
        setSmsText(m * 60 + s)
      },
      () => {
        setSmsTextEnd()
      }
    )
    return () => {
      countDownRef.current.clean()
    }
  }, [])

  const setSmsText = (num) => {
    setPhoneSmsText('重发(' + num + ')')
    setEmailSmsText('重发(' + num + ')')
  }

  const setSmsTextEnd = () => {
    setPhoneSmsText('发送验证码')
    setPhoneDisable(false)
    setEmailSmsText('发送验证码')
    setEmailDisable(false)
  }

  const sendPhoneSmsCode = () => {
    if (!phone || !checkMobile(phone)) {
      toast({
        title: '手机号格式错误'
      })
      return
    }
    sendForgetSmsCode(phone)
      .then(() => {
        setPhoneDisable(true)
        setEmailDisable(true)
        countDownRef.current.start(0, 2, 0)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const sendEmailSmsCode = () => {
    if (!mail || !checkEmail(mail)) {
      toast({
        title: '邮箱格式错误'
      })
      return
    }
    sendForgetEmailCode(mail)
      .then(() => {
        setPhoneDisable(true)
        setEmailDisable(true)
        countDownRef.current.start(0, 2, 0)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const validateFormHandler = () => {
    if (phoneForm) {
      if (!phone || !checkMobile(phone)) {
        toast({
          title: '手机号格式错误'
        })
        return
      }
      if (!phoneSmsCode) {
        toast({
          title: '验证码错误'
        })
        return
      }
    }
    if (!phoneForm) {
      if (!mail || !checkEmail(mail)) {
        toast({
          title: '邮箱格式错误'
        })
        return
      }
      if (!emailSmsCode) {
        toast({
          title: '验证码错误'
        })
        return
      }
    }
    props.checkMemberCode(phone, mail, phoneForm ? phoneSmsCode : emailSmsCode, phoneForm ? 1 : 2)
  }

  return (
    <View className='box'>
      <View className='form'>
        <View className='cell'>
          {phoneForm ? (
            <CellGroup inset>
              <Field label='手机号' placeholder='请输入手机号' value={phone} onChange={(e: any) => setPhone(e.detail)} />
              <Field
                label='短信验证码'
                placeholder='请输入验证码'
                value={phoneSmsCode}
                type='number'
                maxlength={6}
                onChange={(e) => setPhoneSmsCode(e.detail)}
                renderButton={
                  <Button size='small' plain type='info' onClick={sendPhoneSmsCode} disabled={phoneDisable}>
                    {phoneSmsText}
                  </Button>
                }
              />
            </CellGroup>
          ) : (
            <CellGroup inset>
              <Field label='邮箱' placeholder='请输入邮箱' value={mail} onChange={(e) => setMail(e.detail)} />
              <Field
                label='邮箱验证码'
                placeholder='请输入验证码'
                value={emailSmsCode}
                type='number'
                maxlength={6}
                onChange={(e) => setEmailSmsCode(e.detail)}
                renderButton={
                  <Button size='small' plain type='info' onClick={sendEmailSmsCode} disabled={emailDisable}>
                    {emailSmsText}
                  </Button>
                }
              />
            </CellGroup>
          )}
        </View>

        <View className='swtch'>
          <View>没有绑定过的手机或邮箱无法找回</View>
          <Button type='warning' size='small' plain onClick={() => setPhoneForm(!phoneForm)}>
            {phoneForm ? '邮箱找回' : '手机号找回'}
          </Button>
        </View>
      </View>
      <View className='van-page-button'>
        <Button type='info' block onClick={validateFormHandler}>
          下一步
        </Button>
      </View>
    </View>
  )
}

export default Auth
