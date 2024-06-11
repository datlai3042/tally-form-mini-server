import { NextFunction, Response } from 'express'
import { CREATE } from '~/Core/response.success'
import FormAnswerService from '~/services/formAnswer.service'
import { CustomRequest } from '~/type'

class FormAnswerController {
      static async addAnswerForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormAnswerService.addAnswerForm(req, res, next) }).send(res)
      }

      static async getFormAnswer(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormAnswerService.getFormAnswer(req, res, next) }).send(res)
      }
}

export default FormAnswerController
