import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success.js'
import FormService from '~/services/form.service.js'
import { CustomRequest } from '~/type.js'

class FormController {
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.createForm(req, res, next) }).send(res)
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.getForms(req, res, next) }).send(res)
      }

      static async getFormId(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.getFormId(req, res, next) }).send(res)
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
