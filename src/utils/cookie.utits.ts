import { Response } from 'express'
import { setCookieResponse } from './dataResponse.utils'
import ms from 'ms'

export const setCookieAuth = ({
      client_id,
      code_verify_token,
      refresh_token,
      access_token,
      res
}: {
      client_id: string
      code_verify_token: string
      refresh_token: string

      access_token: string
      res: Response
}) => {
      const now = new Date().getTime()
      const expireCookieTime = new Date(Number(now + ms(process.env.EXPIRE_REFRESH_TOKEN as string))).toUTCString()
  
      const expireTokenTime = new Date(Number(now + ms(process.env.EXPIRE_ACCESS_TOKEN as string))).toUTCString()

      setCookieResponse(res, expireCookieTime, 'client_id', client_id, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'code_verify_token', code_verify_token, { httpOnly: true })

     setCookieResponse(res, expireCookieTime, 'access_token', access_token, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'refresh_token', refresh_token, { httpOnly: true })

      return { expireToken: new Date(expireTokenTime), expireCookie: new Date(expireCookieTime)}
}

export const clearCookieAuth = ({ res }: { res: Response }) => {
      res.clearCookie('client_id')
      res.clearCookie('refresh_token')
      res.clearCookie('code_verify_token')
      res.clearCookie('access_token')
}
