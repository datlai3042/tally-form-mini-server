import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { generateInputSettingDefault, inputSettingOption, inputSettingText } from '~/constants/input.constants'
import formModel from '~/model/form.model'
import { coreInputText, coreInputTextModel, inputModel } from '~/model/input.model'
import { Core, CustomRequest, Form, InputCore } from '~/type'
import { generateInputSettingWithType } from '~/utils/input.utils'

class FormInputService {
      static async addInputAndSetTitle(req: CustomRequest<{ form: Form.FormCore; title: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form, title } = req.body

            const newInput = { core: { setting: inputSettingText }, type: 'TEXT' }

            const formTitle = { ...form.form_title, form_title_value: title }

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id },
                  { $push: { form_inputs: newInput }, $set: { form_title: formTitle } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
      }

      static async updateTitleInput(
            req: CustomRequest<{ input_title_value: string; input_id: Types.ObjectId; form: Form.FormCore }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id, input_title_value } = req.body

            const foundFormQuery = {
                  _id: form._id,
                  form_owner: user?._id,
                  'form_inputs._id': input_id
            }

            const updateForm = {
                  'form_inputs.$.input_title': input_title_value
            }

            const options = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(foundFormQuery, updateForm, options)

            return { form: formUpdate }
      }

      static async updateSettingInput(
            req: CustomRequest<{
                  form: Form.FormCore
                  input_id: Types.ObjectId
                  input_id_setting: InputCore.InputSettingTextCommon
            }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id, input_id_setting } = req.body

            const formQueryDoc = { form_owner: user?._id, _id: form._id, 'form_inputs._id': input_id }

            const formUpdateDoc = {
                  $set: {
                        'form_inputs.$.core.setting': input_id_setting
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            console.log({ form: JSON.stringify(formUpdate) })

            return { form: formUpdate }
      }

      static async addInput(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.body
            const newInput = await inputModel.create({ core: { setting: inputSettingText }, type: 'TEXT' })

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form_id, form_owner: user?._id },
                  { $push: { form_inputs: newInput } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
      }

      static async addInputToEnter(
            req: CustomRequest<{ form: Form.FormCore; input_id_target: Types.ObjectId; setting: typeof inputSettingText }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id_target, setting } = req.body

            const indexInputCurrentEvent = form.form_inputs.findIndex((ip) => ip._id === input_id_target)

            const newInput = await inputModel.create({ core: { setting }, type: 'TEXT' })
            form.form_inputs.splice(indexInputCurrentEvent + 1, 0, newInput.toObject())

            const foundForm = { form_owner: user?._id, _id: form._id }
            const updateForm = { $set: { form_inputs: form.form_inputs } }
            const options = { new: true, upsert: true }

            const newFormUpdate = await formModel.findOneAndUpdate(foundForm, updateForm, options)

            return { form: newFormUpdate }
      }

      static async changeInputType(
            req: CustomRequest<{ form: Form.FormCore; inputItem: InputCore.InputForm; type: InputCore.InputForm['type'] }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, inputItem, type } = req.body
            const core = generateInputSettingWithType(type, form, inputItem)
            const tempObject = {
                  type,
                  core
            }

            console.log({ core })

            const foundForm = { _id: form._id, form_owner: user?._id, form_inputs: { $elemMatch: { _id: inputItem._id } } }
            const updateForm = {
                  $set: {
                        'form_inputs.$.core': core,
                        'form_inputs.$.type': type
                  }
            }
            const options = { new: true, upsert: true }

            const newForm = await formModel.findOneAndUpdate(foundForm, updateForm, options)

            return { form: newForm }
      }
}

export default FormInputService
