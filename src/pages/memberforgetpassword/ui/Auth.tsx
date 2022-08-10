/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-27 03:47:42
 * @LastEditTime: 2022-08-10 09:05:59
 * @LastEditors: Derek Xu
 */
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import { useToast } from 'taro-hooks'
import { checkMobile, checkEmail } from '@/utils'
import { Button, CellGroup, Field } from '@antmjs/vantui'
import { sendForgetPasswordCode } from '@/api/forget'

interface IPageOption {
  checkMemberCode: (phone: string, mail: string, code: string, form: number) => void
}

const Auth: FunctionComponent<IPageOption> = (props) => {
  const [phoneSmsText, setPhoneSmsText] = useState<string>('发送验证码')
  const [phoneDisable, setPhoneDisable] = useState<boolean>(false)
  const smsCodeRef = useRef<number>(0)
  const [phoneForm, setPhoneForm] = useState<boolean>(true)
  const [phone, setPhone] = useState<string>('')
  const [phoneSmsCode, setPhoneSmsCode] = useState<string>('')
  const [mail, setMail] = useState('')
  const [emailSmsCode, setEmailSmsCode] = useState<string>('')
  const [emailSmsText, setEmailSmsText] = useState('发送验证码')
  const [emailDisable, setEmailDisable] = useState<boolean>(false)
  const emailSmsCodeRef = useRef<number>(0)

  const [toast] = useToast({
    icon: 'error'
  })

  useEffect(() => {
    return () => {
      if (smsCodeRef.current > 0) {
        window.clearTimeout(smsCodeRef.current)
        smsCodeRef.current = 0
      }
      if (emailSmsCodeRef.current > 0) {
        window.clearTimeout(emailSmsCodeRef.current)
        emailSmsCodeRef.current = 0
      }
    }
  }, [])

  const sendPhoneSmsCode = () => {
    if (!phone || !checkMobile(phone)) {
      toast({
        title: '手机号格式错误'
      })
      return
    }
    sendForgetPasswordCode(phone, '', 1)
      .then(() => {
        setPhoneSmsTextTime(120)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const setPhoneSmsTextTime = (num: number) => {
    if (num === 0) {
      setPhoneSmsText('发送验证码')
      setPhoneDisable(false)

      if (smsCodeRef.current > 0) {
        window.clearTimeout(smsCodeRef.current)
        smsCodeRef.current = 0
      }
      return
    }
    setPhoneSmsText('重发(' + num + ')')
    setPhoneDisable(true)

    smsCodeRef.current = window.setTimeout(() => {
      setPhoneSmsTextTime(num - 1)
    }, 1000)
  }

  const sendEmailSmsCode = () => {
    if (!mail || !checkEmail(mail)) {
      toast({
        title: '邮箱格式错误'
      })
      return
    }
    sendForgetPasswordCode('', mail, 2)
      .then(() => {
        setEmailSmsTextTime(120)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const setEmailSmsTextTime = (num: number) => {
    if (num === 0) {
      setEmailSmsText('发送验证码')
      setEmailDisable(false)

      if (emailSmsCodeRef.current > 0) {
        window.clearTimeout(emailSmsCodeRef.current)
        emailSmsCodeRef.current = 0
      }
      return
    }
    setEmailSmsText('重发(' + num + ')')
    setEmailDisable(true)

    emailSmsCodeRef.current = window.setTimeout(() => {
      setEmailSmsTextTime(num - 1)
    }, 1000)
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
                placeholder='请输入短信验证码'
                value={phoneSmsCode}
                type='number'
                maxlength={4}
                onChange={(e) => setPhoneSmsCode(e.detail)}
                renderButton={
                  <Button size='small' type='info' onClick={sendPhoneSmsCode} disabled={phoneDisable}>
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
                placeholder='请输入邮箱验证码'
                value={emailSmsCode}
                type='number'
                maxlength={4}
                onChange={(e) => setEmailSmsCode(e.detail)}
                renderButton={
                  <Button size='small' type='info' onClick={sendEmailSmsCode} disabled={emailDisable}>
                    {emailSmsText}
                  </Button>
                }
              />
            </CellGroup>
          )}
        </View>

        <View className='swtch'>
          <View>没有绑定过的手机无法找回</View>
          <Button type='warning' size='small' onClick={() => setPhoneForm(!phoneForm)}>
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
