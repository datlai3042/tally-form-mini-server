import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { generateInputSettingDefault, inputSettingOption, inputSettingText } from '~/constants/input.constants'
import formModel from '~/model/form.model'
import { coreInputText, coreInputTextModel, inputModel } from '~/model/input.model'
import { Core, CustomRequest, Form, InputCore } from '~/type'
import { generateInputSettingWithType } from '~/utils/input.utils'

import { v4 as uuidv4 } from 'uuid'

class FormInputService {
      static async addInputAndSetTitle(req: CustomRequest<{ form: Form.FormCore; title: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form, title } = req.body

            const newInput = await inputModel.create({ core: { setting: inputSettingText }, type: 'TEXT' })

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

      static async addInput(req: CustomRequest<{ form: Form.FormCore }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form } = req.body

            const newInput = await inputModel.create({ core: { setting: inputSettingText } })

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id },
                  { $push: { form_inputs: newInput } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
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

            const inputItem = await inputModel.findOne({ _id: new Types.ObjectId(input_id) })
            inputItem!.core.setting = input_id_setting
            const formQueryDoc = { form_owner: user?._id, _id: form._id, 'form_inputs._id': inputItem?._id }

            console.log({ inputItem })

            const formUpdateDoc = {
                  $set: {
                        'form_inputs.$.core': inputItem!.core
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            console.log({ form: JSON.stringify(formUpdate) })

            return { form: formUpdate }
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

            const updateInput = await inputModel.findOneAndUpdate({ _id: inputItem._id }, { $set: { core: core } }, { new: true, upsert: true })

            const foundForm = { _id: form._id, form_owner: user?._id, 'form_inputs._id': updateInput?._id }
            const updateForm = { 'form_inputs.$.core': updateInput?.toObject().core, 'form_inputs.$.type': type }
            const options = { new: true, upsert: true }

            const newForm = await formModel.findOneAndUpdate(foundForm, updateForm, options)

            return { form: newForm }
      }

      static async updatePositionOption(
            req: CustomRequest<{
                  form: Form.FormCore
                  inputItem: InputCore.InputOption.InputTypeOption
                  coreOption: InputCore.InputOption.InputTypeOption['core']['options']
            }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, inputItem, coreOption } = req.body

            const updateInput = await inputModel.findOneAndUpdate(
                  { _id: inputItem._id },
                  { $set: { core: { options: coreOption, setting: inputItem.core.setting } } },
                  { new: true, upsert: true }
            )

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id, 'form_inputs._id': inputItem._id },
                  { $set: { 'form_inputs.$.core': updateInput?.toObject().core } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
      }

      static async addOption(
            req: CustomRequest<{ form: Form.FormCore; option_id: string; option_value: string; inputItem: InputCore.InputOption.InputTypeOption }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, option_id, option_value, inputItem } = req.body
            const findOption = inputItem.core.options.findIndex((op) => op.option_id === option_id)
            if (findOption === -1) {
                  inputItem.core.options.push({ option_id: uuidv4(), option_value: option_value })
            } else {
                  inputItem.core.options[findOption] = { option_id, option_value }
            }

            console.log({ inputCore: JSON.stringify(inputItem.core.options), findOption })

            const updateInput = await inputModel.findOneAndUpdate(
                  { _id: inputItem._id },
                  { $set: { core: { options: inputItem.core.options, setting: inputItem.core.setting } } },
                  { new: true, upsert: true }
            )

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id, 'form_inputs._id': inputItem._id },
                  { $set: { 'form_inputs.$.core': updateInput?.toObject().core } },
                  { new: true, upsert: true }
            )

            return { form: newForm }
      }

      static async deleteOptionId(
            req: CustomRequest<object, { form_id: Form.FormCore['_id']; inputItem_id: InputCore.InputOption.InputTypeOption['_id']; option_id: string }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form_id, inputItem_id, option_id } = req.query

            //cập nhập input
            const queryInput = { _id: inputItem_id, 'core.options.option_id': option_id }
            const updateInput = { $pull: { 'core.options': { option_id: option_id } } }
            const options = { new: true, upsert: true }
            const superInput = await inputModel.findOneAndUpdate(queryInput, updateInput, options)

            //cập nhập form tổng
            const queryForm = { _id: form_id, form_owner: user?._id, 'form_inputs._id': inputItem_id }
            const updateForm = { $set: { 'form_inputs.$.core': superInput?.toObject().core } }
            const superForm = await formModel.findOneAndUpdate(queryForm, updateForm, options)

            return { form: superForm }
      }
}

export default FormInputService
