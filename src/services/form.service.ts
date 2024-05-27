import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import cloudinary from '~/configs/cloudinary.config'
import formModel from '~/model/form.model'
import { CustomRequest, FormEdit } from '~/type'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class FormService {
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formQuery = { form_owner: user?._id }
            const form = await formModel.create(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'create form failure' })
            return { form_id: await form._id }
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const forms = await formModel.find({ form_owner: new Types.ObjectId(user?._id) })
            return { forms }
      }

      static async getFormId(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            console.log({ form_id })
            const form = await formModel.findOneAndUpdate({ _id: new Types.ObjectId(form_id) }, {}, { upsert: true, new: true })

            return { form }
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
            const { form } = req.body
            console.log({ body: req.body })
            // const form_state = form.form_state
            const formQueryDoc = { form_owner: user?._id, _id: new Types.ObjectId(form._id) }

            const formUpdateDoc = {
                  $set: {
                        form_title: form.form_title,
                        form_setting_default: form.form_setting_default,
                        form_background: form.form_background,
                        form_state: form.form_state,
                        form_inputs: form.form_inputs
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)
            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      static async uploadAvatar(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const folder = `tally-form-project/users/${user?.id}/form_id/avatar`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)
            const form_avatar = { form_avatar_url: result.secure_url, form_avatar_publicId: result.public_id }
            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $set: { form_avatar } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }

      static async deleteAvatar(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const { user } = req

            const foundForm = await formModel.findOne({ _id: new Types.ObjectId(form_id) })
            if (!foundForm || !foundForm.form_avatar) {
                  throw new BadRequestError({ metadata: 'Không tìm thấy thông tin' })
            }
            const deleteAvatar = await cloudinary.uploader.destroy(foundForm.form_avatar.form_avatar_publicId)

            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $unset: { form_avatar: 1 } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate?.form_avatar }
      }

      static async uploadCover(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const folder = `tally-form-project/users/${user?.id}/form_id/cover`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)
            const form_cover = { form_background_iamge_url: result.secure_url, form_backround_image_publicId: result.public_id }
            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $set: { form_background: form_cover } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate?.form_background }
      }

      static async deleteCover(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const { user } = req

            const foundForm = await formModel.findOne({ _id: new Types.ObjectId(form_id) })
            if (!foundForm || !foundForm.form_background) {
                  throw new BadRequestError({ metadata: 'Không tìm thấy thông tin' })
            }
            const deleteAvatar = await cloudinary.uploader.destroy(foundForm.form_background.form_backround_image_publicId)

            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $unset: { form_avatar: 1 } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }
}

export default FormService
