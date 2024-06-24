import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError, NotFoundError } from '~/Core/response.error'
import cloudinary from '~/configs/cloudinary.config'
import { inputSettingText } from '~/constants/input.constants'
import formModel, { FormModeDisplay, FormSchema, FormState, FormTitleSub, formTitleSubModel } from '~/model/form.model'
import formAnswerModel, { formAnswerMiniModel } from '~/model/formAnswer.model'
import { inputModel } from '~/model/input.model'
import { notificationModel, notificationUserModel } from '~/model/notification.model'
import { CustomRequest, Form, FormEdit, Http, InputCore, Notification } from '~/type'
import createANotification from '~/utils/notification'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class FormService {
      //GET Thông tin FORM
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formQuery = { form_owner: user?._id }
            const form = await formModel.create(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'Tạo Form thất bại' })

            const notification = await createANotification({ user_id: user?._id, type: 'System', core: { message: 'Bạn đã tạo một Form' } })

            return { form_id: await form._id }
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const forms = await formModel.find({ form_owner: new Types.ObjectId(user?._id), form_state: { $ne: 'isDelete' } })
            return { forms }
      }

      static async getListFormDelete(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const forms = await formModel.find({ form_owner: user?._id, form_state: 'isDelete' })
            return { forms }
      }

      static async getFormId(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req
            const form = await formModel.findOne({ _id: new Types.ObjectId(form_id), form_owner: user?._id })

            return { form: form ? form : null }
      }

      static async getInfoFormNotification(
            req: CustomRequest<object, { form_id: string; notification_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { form_id, notification_id } = req.query
            const { user } = req
            const form = await formModel
                  .findOne({ _id: new Types.ObjectId(form_id), form_owner: user?._id })
                  .select('form_title form_avatar form_setting_default')

            return { form: form ? form : null }
      }

      static async getFormUpdate(req: CustomRequest<FormEdit.FindFormParams>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.body
            const formQuery = { form_owner: user?._id, _id: new Types.ObjectId(form_id) }
            const form = await formModel.findOne(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'Tạo Form thất bại' })
            return { form }
      }

      static async getFormGuess(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const form_state: FormState = 'isPublic'
            const formQuery = { _id: new Types.ObjectId(form_id), form_state }
            const form = await formModel.findOne(formQuery)

            return { form: form ? form : null }
      }

      //DELETE FORM
      static async deleteFormId(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req
            const form = await formModel.findOneAndUpdate(
                  { _id: new Types.ObjectId(form_id), form_owner: user?._id },
                  { $set: { form_state: 'isDelete' } },
                  { new: true, upsert: true }
            )

            return { form: form ? form : null }
      }

      static async deleteFormForever(req: CustomRequest<object, { form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.query

            const formQuery = { _id: form_id, form_owner: user?._id }
            const formTitleSubQuery = { form_id: form_id }

            const options = { new: true, upsert: true }

            const deleteForm = await formModel.findOneAndDelete(formQuery, options)
            const deleteFormTitleSub = await formTitleSubModel.findOneAndDelete(formTitleSubQuery, options)
            const deleteFormAnswerMini = await formAnswerMiniModel.findOneAndDelete(formTitleSubQuery, options)
            const deleteFormAnswer = await formAnswerModel.findOneAndDelete(formTitleSubQuery, options)

            const found_notification_user = { notification_user_id: user?._id }

            await notificationModel.findOneAndDelete({ 'core.form_id': form_id.toString() })

            const createNotification = await createANotification({ user_id: user?._id, type: 'System', core: { message: 'Đã xóa vĩnh viễn một form' } })

            const notification_user = await notificationUserModel.findOne(found_notification_user)
            notification_user!.notifications = notification_user?.notifications.filter((notification) => {
                  if (notification.type === 'Form_Answers' && notification.core.form_id == form_id.toString()) {
                        return null
                  }
                  return notification
            }) as Notification.NotifcationCore[]

            console.log({ notifications: notification_user?.notifications })
            notification_user?.save()

            return { message: 'Xóa thành công' }
      }

      //UPDATE FORM HIỂN THỊ
      static async changeModeForm(req: CustomRequest<{ mode: FormState; form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, mode } = req.body
            //update
            const formQuery = { _id: form_id, form_owner: user?._id }
            const formUpdate = { $set: { form_state: mode } }
            const formOptions = { new: true, upsert: true }

            const newForm = await formModel.findOneAndUpdate(formQuery, formUpdate, formOptions)

            return { form: newForm }
      }

      static async changeModeDisplay(req: CustomRequest<{ mode: FormModeDisplay; form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, mode } = req.body
            //update
            const formQuery = { _id: form_id, form_owner: user?._id }
            const formUpdate = { $set: { form_mode_display: mode } }
            const formOptions = { new: true, upsert: true }

            const newForm = await formModel.findOneAndUpdate(formQuery, formUpdate, formOptions)

            return { form: newForm }
      }

      static async setModeImageForm(req: CustomRequest<{ form_id: Types.ObjectId; mode: 'Slider' | 'Normal' }>, res: Response, next: NextFunction) {
            const { form_id, mode } = req.body
            const { user } = req

            const updateFormQuery = { form_owner: user?._id, _id: form_id }
            const updateFormUpdate = { $set: { 'form_title.form_title_mode_image': mode } }
            const updateFormOption = { new: true, upsert: true }

            const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)

            return { form: updateFormDoc }
      }

      //UPDATE TIÊU ĐỀ FORM

      static async setTitleForm(req: CustomRequest<{ form_id: Types.ObjectId; value: string }>, res: Response, next: NextFunction) {
            const { form_id, value } = req.body
            const { user } = req

            const updateFormQuery = { form_owner: user?._id, _id: form_id }
            const updateFormUpdate = { $set: { 'form_title.form_title_value': value } }
            const updateFormOption = { new: true, upsert: true }

            const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)

            return { form: updateFormDoc }
      }

      static async addSubTitleItem(req: CustomRequest<{ type: FormTitleSub['type']; form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, type } = req.body
            const formTitle = await formTitleSubModel.create({ type, form_id: form_id })
            //update
            const formQuery = { _id: form_id, form_owner: user?._id }
            const formUpdate = { $push: { 'form_title.form_title_sub': formTitle } }
            const formOptions = { new: true, upsert: true }

            const newForm = await formModel.findOneAndUpdate(formQuery, formUpdate, formOptions)

            return { form: newForm }
      }

      static async uploadTitleImage(req: CustomRequest<{ form_id: string; titleSubId: string }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id, titleSubId } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const form = await formModel.findOne({ _id: new Types.ObjectId(form_id) })
            if (!form) throw new BadRequestError({ metadata: 'form_id không hợp lệ' })

            const folder = `tally-form-project/users/${user?.id}/${form._id}/title/images`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            const titleSubItem = form.form_title?.form_title_sub.map((ft) => {
                  console.log(ft._id, titleSubId)
                  if (new Types.ObjectId(ft._id).toString() === titleSubId) {
                        console.log(ft._id === titleSubId, titleSubId)
                        ft.value = result.secure_url
                        ft.write = true
                        return ft
                  }
                  return ft
            })

            const formQueryDoc = { _id: new Types.ObjectId(form._id), form_owner: user?._id }
            const formUpdateDoc = { $set: { 'form_title.form_title_sub': titleSubItem } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
      }

      static async updateTitleSubText(
            req: CustomRequest<{ form_title_sub_id: Types.ObjectId; form_title_sub_content: string; form_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form_id, form_title_sub_content, form_title_sub_id } = req.body
            const formQueryDoc = { form_owner: user?._id, _id: new Types.ObjectId(form_id), 'form_title.form_title_sub._id': form_title_sub_id }

            const formUpdateDoc = {
                  $set: {
                        'form_title.form_title_sub.$.value': form_title_sub_content
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            console.log({ formUpdateDoc: JSON.stringify(formUpdate) })

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      static async addInputToTitle(req: CustomRequest<{ form: Form.FormCore }>, res: Response, next: NextFunction) {
            // const { form } = req.body
            // const { user } = req
            // const updateFormQuery = { form_owner: user?._id, _id: form._id }
            // const updateFormUpdate = { $set: { form_title: form.form_title, form_inputs: form.form_inputs } }
            // const updateFormOption = { new: true, upsert: true }

            // const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)

            // return { form: updateFormDoc }

            const { user } = req
            const { form } = req.body

            const newInput = await inputModel.create({ core: { setting: inputSettingText }, type: 'TEXT' })

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id },
                  { $push: { form_inputs: newInput } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
      }

      static async updateForm(req: CustomRequest<FormEdit.FormEditParams & { inputItem: InputCore.InputForm }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form, inputItem } = req.body
            const formQueryDoc = { form_owner: user?._id, _id: new Types.ObjectId(form._id) }

            const formUpdateDoc = {
                  $set: {
                        form_title: form.form_title,
                        form_setting_default: form.form_setting_default,
                        form_background: form.form_background,
                        form_avatar: form.form_avatar,
                        form_state: form.form_state,
                        form_inputs: form.form_inputs,
                        form_mode_display: form.form_mode_display
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      // UPDATE IMAGE CỦA FORM
      static async addAvatar(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const formQueryDoc = { _id: new Types.ObjectId(form._id), form_owner: user?._id }
            const formUpdateDoc = { $set: { form_avatar_state: true, form_avatar: { mode: 'circle', position: 'left' } } }
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

      static async deleteAvatar(req: CustomRequest<{ form_id: string; mode: 'Image' | 'NoFile' }>, res: Response, next: NextFunction) {
            const { form_id, mode } = req.body
            const { user } = req

            const foundForm = await formModel.findOne({ _id: new Types.ObjectId(form_id) })

            if (mode === 'Image') {
                  if (foundForm && foundForm.form_avatar) {
                        const deleteAvatar = await cloudinary.uploader.destroy(foundForm.form_avatar.form_avatar_publicId)
                  }

                  const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
                  const formUpdateDoc = { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } }
                  const formOptions = { new: true, upsert: true }

                  const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

                  return { form: formUpdate }
            }

            const formQueryDoc = { _id: new Types.ObjectId(form_id), form_owner: user?._id }
            const formUpdateDoc = { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } }
            const formOptions = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions)

            return { form: formUpdate }
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

            return { form: formUpdate }
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
}

export default FormService
