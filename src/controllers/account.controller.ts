import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import AccountService from '~/services/account.service'
import { CustomRequest } from '~/type'

class AccountController {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.me(req, res, next) }).send(res)
      }
}

export default AccountController
