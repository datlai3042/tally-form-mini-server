import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import formModel from '~/model/form.model'
import formAnswerModel, { oneAnswer } from '~/model/formAnswer.model'
import { CustomRequest, Form, Notification } from '~/type'
import createANotification from '~/utils/notification'

class FormAnswerService {
      static async addAnswerForm(
            req: CustomRequest<{ formAnswer: Form.FormAnswer.TFormAnswer & { form_owner: Types.ObjectId } }>,
            res: Response,
            next: NextFunction
      ) {
            const { formAnswer } = req.body

            const found_form_origin = await formModel.findOne({ _id: formAnswer.form_id }).select('form_title form_avatar form_setting_default')

            const oneAnswerData = await oneAnswer.create({ form_id: formAnswer.form_id, answers: formAnswer.answers })

            const formAnswerQuery = { form_id: formAnswer.form_id, owner_id: formAnswer.form_owner }
            const formAnswerUpdate = { $push: { reports: oneAnswerData._id } }
            const formAnswerOption = { new: true, upsert: true }

            const findFormOrigin = await formAnswerModel.findOneAndUpdate(formAnswerQuery, formAnswerUpdate, formAnswerOption).populate('reports')

            const socketOwnerForm = global._userSocket[findFormOrigin?.owner_id as unknown as string]
            const createNotification = await createANotification({
                  user_id: findFormOrigin?.owner_id as Types.ObjectId,
                  type: 'Form_Answers',
                  core: {
                        message: `bạn đã nhận 1 phiếu trả lời`,
                        form_id: findFormOrigin?.form_id as unknown as string,
                        form_answer_id: oneAnswerData._id as unknown as string
                  }
            })

            createNotification!.notifications!.notifications = createNotification!.notifications?.notifications.sort(
                  (a, b) => b.create_time.getTime() - a.create_time.getTime()
            ) as Notification.NotifcationCore[]

            if (socketOwnerForm) {
                  global._io.to(global._userSocket[findFormOrigin?.owner_id as unknown as string].socket_id).emit('add-new-reports', {
                        type: 'Answer',
                        formAnswer: findFormOrigin,
                        notification: createNotification.notifications,
                        notification_item_id: createNotification.notification_item_id,
                        form_origin: found_form_origin
                  })
            }
            return { message: 'Gửi thành công' }
      }

      static async getFormAnswer(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req
            const formAnswerQuery = { form_id: form_id, owner_id: user?._id }
            // const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } }
            // const formAnswerOption = { new: true, upsert: true }
            const findFormOrigin = await formAnswerModel.findOne(formAnswerQuery).populate('reports')

            return { formAnswer: findFormOrigin }
      }
}

export default FormAnswerService
