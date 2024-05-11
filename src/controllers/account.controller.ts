import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success.js'
import AccountService from '~/services/account.service.js'
import { CustomRequest } from '~/type.js'

class AccountController {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.me(req, res, next) }).send(res)
      }

      static async updateAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await AccountService.updateAvatar(req, res, next) }).send(res)
      }

      static async updateEmail(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.updateEmail(req, res, next) }).send(res)
      }
      static async updatePassword(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.updatePassword(req, res, next) }).send(res)
      }
}

export default AccountController
