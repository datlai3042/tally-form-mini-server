import { NextFunction, Request, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import AuthService from '~/services/auth.service'
import { CustomRequest } from '~/type'

class AuthController {
      static async register(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await AuthService.register(req, res, next) }).send(res)
      }

      static async login(req: Request, res: Response, next: NextFunction) {
            return new OK({ metadata: await AuthService.login(req, res, next) }).send(res)
      }

      static async logout(req: Request, res: Response, next: NextFunction) {
            return new OK({ metadata: await AuthService.logout(req, res, next) }).send(res)
      }

      static async refresh_token(req: Request, res: Response, next: NextFunction) {
            return new OK({ metadata: await AuthService.refresh_token(req, res, next) }).send(res)
      }
}

export default AuthController
