import { Document, Schema, Types, model } from 'mongoose'
import { Form } from '~/type'

const DOCUMENT_NAME = 'FormAnswer'
const COLLECTION_NAME = 'formAnswers'

const inputData = new Schema<Form.FormAnswer.InputFormData>({
      _id: { type: String, required: true },
      mode: { type: String, enum: ['Require', 'Optional'] },
      title: { type: String, required: true },
      type: { type: String, enum: ['TEXT', 'IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION', 'VOTE', 'PHONE'] },
      value: { type: Schema.Types.Mixed }
})

const formAnswer = new Schema<Form.FormAnswer.TFormAnswer>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            answers: { type: [inputData], default: [] },
            create_time: { type: Date, default: Date.now }
      },
      { collection: 'formAnswerItem', timestamps: true }
)
export const formAnswerMiniModel = model('FormAnswerItem', formAnswer)

const formAnswerOrigin = new Schema<Form.FormAnswer.formAnswerOrigin>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            reports: { type: [formAnswer], default: [] }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formAnswerModel = model(DOCUMENT_NAME, formAnswerOrigin)

export default formAnswerModel
