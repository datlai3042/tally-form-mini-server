import { NextFunction, Response } from 'express'
import formModel from '~/model/form.model'
import { inputModel } from '~/model/input.model'
import { CustomRequest, Form, InputCore } from '~/type'
import { v4 as uuidv4 } from 'uuid'

class InputOptionService {
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

export default InputOptionService
