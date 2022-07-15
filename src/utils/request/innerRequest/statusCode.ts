/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-11-09 09:13:14
 * @LastEditTime: 2021-12-20 19:46:24
 * @LastEditors: Derek Xu
 */
export enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  CLIENT_ERROR = 400,
  AUTHENTICATE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  FAILED_DEPENDENCY = 424,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}
