import { Types, UpdateQuery } from 'mongoose'
import { BadRequestError, InternalError } from '~/Core/response.error'
import formModel from '~/model/form.model'

export const foundForm = async ({ form_id, user_id }: { form_id: Types.ObjectId; user_id: Types.ObjectId }) => {
      const form = await formModel.findOne({ _id: form_id, form_owner: user_id })
      if (!form) throw new BadRequestError({ metadata: 'form_id không hợp lệ' })

      return form
}

export const generateUpdateForm = async <T>({
      update,
      form_id,
      form_owner
}: {
      update: UpdateQuery<T>
      form_id: Types.ObjectId
      form_owner: Types.ObjectId
}) => {
      const formQuery = { _id: form_id, form_owner }
      const formOptions = { new: true, upsert: true }
      const newForm = await formModel.findOneAndUpdate(formQuery, update, formOptions)
      if (!newForm) throw new InternalError({ metadata: 'Không thể update form' })
      return newForm
}
