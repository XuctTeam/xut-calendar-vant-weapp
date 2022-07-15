/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2022-03-02 09:12:43
 * @LastEditTime: 2022-07-15 15:53:37
 * @LastEditors: Derek Xu
 */

interface IUploadInfoData {
  url: string
  width: number
  height: number
}

export interface IUploadInfo {
  code: number
  success: boolean
  data: IUploadInfoData
}
