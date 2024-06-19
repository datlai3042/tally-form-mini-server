import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import formAnswerModel from '~/model/formAnswer.model'
import { CustomRequest, Form } from '~/type'

class FormAnswerService {
      static async addAnswerForm(
            req: CustomRequest<{ formAnswer: Form.FormAnswer.TFormAnswer & { form_owner: Types.ObjectId } }>,
            res: Response,
            next: NextFunction
      ) {
            const { formAnswer } = req.body

            const formAnswerQuery = { form_id: formAnswer.form_id, owner_id: formAnswer.form_owner }
            const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } }
            const formAnswerOption = { new: true, upsert: true }
            const findFormOrigin = await formAnswerModel.findOneAndUpdate(formAnswerQuery, formAnswerUpdate, formAnswerOption)
            const socketOwnerForm = global._userSocket[findFormOrigin?.owner_id as unknown as string]
            console.log({ user: global._userSocket, socketOwnerForm })
            if (socketOwnerForm) {
                  console.log({ emit: global._userSocket[findFormOrigin?.owner_id as unknown as string] })
                  global._io
                        .to(global._userSocket[findFormOrigin?.owner_id as unknown as string].socket_id)
                        .emit('add-new-reports', { type: 'Answer', formAnswer: findFormOrigin })
            }
            return { message: 'Gửi thành công' }
      }

      static async getFormAnswer(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req
            const formAnswerQuery = { form_id: form_id, owner_id: user?._id }
            // const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } }
            // const formAnswerOption = { new: true, upsert: true }
            const findFormOrigin = await formAnswerModel.findOne(formAnswerQuery)

            return { formAnswer: findFormOrigin }
      }
}

export default FormAnswerService
