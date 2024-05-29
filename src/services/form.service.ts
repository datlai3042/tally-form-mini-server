import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import cloudinary from '~/configs/cloudinary.config'
import formModel, { FormSchema } from '~/model/form.model'
import { CustomRequest, FormEdit, Http, InputCore } from '~/type'
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
            console.log({ body: JSON.stringify(form) })
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

            console.log({ formUpdateDoc: JSON.stringify(formUpdate) })

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      static async addAvatar(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const formQueryDoc = { _id: new Types.ObjectId(form._id), form_owner: user?._id }
            const formUpdateDoc = { $set: { form_avatar_state: true } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }

      static async addBackground(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const formQueryDoc = { _id: new Types.ObjectId(form._id), form_owner: user?._id }
            const formUpdateDoc = { $set: { form_background_state: true } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

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
            const formUpdateDoc = { $set: { form_avatar, form_avatar_state: true } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }

      static async deleteAvatar(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const { user } = req

            const foundForm = await formModel.findOne({ _id: new Types.ObjectId(form_id) })

            if (foundForm && foundForm.form_avatar) {
                  const deleteAvatar = await cloudinary.uploader.destroy(foundForm.form_avatar.form_avatar_publicId)
            }

            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } }
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
            const formUpdateDoc = { $set: { form_background: form_cover, form_background_state: true } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate?.form_background }
      }

      static async deleteCover(req: CustomRequest<{ form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const { user } = req

            const foundForm = await formModel.findOne({ _id: new Types.ObjectId(form_id) })

            if (foundForm && foundForm.form_background) {
                  const deleteAvatar = await cloudinary.uploader.destroy(foundForm.form_background.form_backround_image_publicId)
            }

            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $unset: { form_background: 1 }, $set: { form_background_state: false } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }

      static async addInputToTitle(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const updateFormQuery = { form_owner: user?._id, _id: form._id }
            const updateFormUpdate = { $set: { form_title: form.form_title, form_inputs: form.form_inputs } }
            const updateFormOption = { new: true, upsert: true }

            const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)

            return { form: updateFormDoc }
      }

      static async setTitleForm(req: CustomRequest<{ title: string; form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form, title } = req.body
            const { user } = req

            const updateFormQuery = { form_owner: user?._id, _id: form._id }
            const updateFormUpdate = { $set: { form_title: title } }
            const updateFormOption = { new: true, upsert: true }

            const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)

            return { form: updateFormDoc }
      }

      static async updateInputItem(
            req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId }; newInput: InputCore.InputForm }>,
            res: Response,
            next: NextFunction
      ) {
            const { form, newInput } = req.body
            const { _id } = newInput
            const formQuery = { _id: form._id, 'form_inputs._id': new Types.ObjectId(_id) }
            const formUpdate = { 'form_inputs.$': newInput }
            const formOption = { new: true, upsert: true }

            const formUpdateDoc = await formModel.findOneAndUpdate(formQuery, formUpdate, formOption)

            return { form: formUpdateDoc }
      }

      static async deleteInputItem(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form } = req.body
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

      static async updateSettingInput(
            req: CustomRequest<{
                  form: FormEdit.FormEditParams & { _id: Types.ObjectId }
                  input_id: Types.ObjectId
                  input_id_setting: InputCore.InputSettingTextCommon
            }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id, input_id_setting } = req.body
            console.log({ body: JSON.stringify(form) })
            const formQueryDoc = { form_owner: user?._id, _id: form._id, 'form_inputs._id': input_id }

            const formUpdateDoc = {
                  $set: {
                        'form_inputs.$.setting': input_id_setting
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            console.log({ formUpdateDoc: JSON.stringify(formUpdate) })

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }
}

export default FormService
