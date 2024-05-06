import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import formModel from '~/model/form.model'
import { CustomRequest, FormEdit } from '~/type'

class FormService {
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formQuery = { form_owner: user?._id }
            const form = await formModel.create(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'create form failure' })
            return { form_id: await form._id }
      }

      static async findFormUpdate(req: CustomRequest<FormEdit.FindFormParams>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.body
            const formQuery = { form_owner: user?._id, _id: new Types.ObjectId(form_id) }
            const form = await formModel.findOne(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'create form failure' })
            return { form }
      }

      static async findFormGuess(req: CustomRequest<FormEdit.FindFormParams>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const formQuery = { _id: new Types.ObjectId(form_id) }
            const form = await formModel.findOne(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'create form failure' })
            return { form }
      }

      static async updateForm(req: CustomRequest<FormEdit.FormEditParams>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, form_update } = req.body

            const form_state = form_update.form_state !== 'isPublic' && form_update.form_title ? 'isPrivate' : 'isDraff'

            const formQueryDoc = { form_owner: user?._id, _id: new Types.ObjectId(form_id) }

            const formUpdateDoc = {
                  $set: {
                        form_title: form_update.form_title,
                        form_setting_default: form_update.form_setting_default,
                        form_background: form_update.form_background,
                        form_state,
                        form_inputs: form_update.form_inputs
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)
            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }
}

export default FormService
