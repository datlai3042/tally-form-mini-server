import { NextFunction, Response } from 'express'
import { CustomRequest } from '~/type'
import { expriresAT, setCookieResponse } from '~/utils/dataResponse.utils'

class AccountService {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req

            const expireToken = setCookieResponse(res, expriresAT, 'test', 'success', { httpOnly: true })

            return { user }
      }
}

export default AccountService
