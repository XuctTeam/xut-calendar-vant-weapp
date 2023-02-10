/*
 * @Author: Derek Xu
 * @Date: 2022-09-30 08:52:52
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-02-09 15:16:10
 * @FilePath: \xut-calendar-vant-weapp\src\constants\url.ts
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
//@ts-ignore
const DEFAULT_IMAGES_SERVER = SERVICES_IMAGES

//@ts-ignore
const DEFUALT_SERVICES = SERVICES_API

const SECURITY_OAUTH2_IGNORE_URL = [
  '/api/app/v1/sms/anno/login',
  '/api/app/v1/sms/anno/forget',
  '/api/app/v1/email/anno/forget',
  '/api/app/v1/member/anno/forget/modify',
  '/api/app/v1/member/anno/forget/check',
  '/api/app/v1/sms/anno/register'
]

export { DEFAULT_IMAGES_SERVER, DEFUALT_SERVICES, SECURITY_OAUTH2_IGNORE_URL }
