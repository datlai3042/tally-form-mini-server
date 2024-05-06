import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import FormService from '~/services/form.service'
import { CustomRequest } from '~/type'

class FormController {
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.createForm(req, res, next) }).send(res)
      }

      static async findFormUpdate(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.findFormUpdate(req, res, next) }).send(res)
      }

      static async findFormGuess(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.findFormGuess(req, res, next) }).send(res)
      }

      static async updateForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateForm(req, res, next) }).send(res)
      }
}

export default FormController
