import { NextFunction, Response } from 'express'
import { CustomRequest } from '~/type'

class AccountService {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            console.log('api request')
            const { user } = req
            // console.log({ user })
            return { user }
      }
}

export default AccountService
