/* eslint-disable @typescript-eslint/no-shadow */
/*
 * @Description:
 * @Version: 1.0
 * @Autor: Derek Xu
 * @Date: 2022-02-28 21:26:26
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-03-02 14:03:09
 */
import { useCallback, useEffect, useRef } from 'react'
import { back, BackOption } from '../index'

export type Back = (option?: Partial<BackOption>) => Promise<TaroGeneral.CallbackResult>

const useBack = (option?: Partial<BackOption>): [Back] => {
  const initialOption = useRef<Partial<BackOption>>()

  useEffect(() => {
    initialOption.current = option
  }, [option])

  const backAsync = useCallback<Back>(
    (option?: Partial<BackOption>) => {
      return new Promise((resolve, reject) => {
        try {
          if (!option && !initialOption.current) {
            console.warn('please provide a option')
            return reject(new Error('please provide a option'))
          } else {
            const options = Object.assign({ to: 1 }, initialOption.current || {}, option || {})
            resolve(back({ ...(options as BackOption) }))
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    [initialOption]
  )
  return [backAsync]
}

export default useBack
