import { NextFunction, Response } from 'express'
import { CustomRequest } from '~/type'
import { expriresAT, setCookieResponse } from '~/utils/dataResponse.utils'

class AccountService {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            console.log('api request')
            const { user } = req
            // console.log({ user })
            const expireToken = setCookieResponse(res, expriresAT, 'test', 'success', { httpOnly: true })

            return { user }
      }
}

export default AccountService
