import { Document, Schema, Types, model } from 'mongoose'
import { Form } from '~/type'

const DOCUMENT_NAME = 'FormAnswerCore'
const COLLECTION_NAME = 'formAnswersCore'

const inputData = new Schema<Form.FormAnswer.InputFormData>({
      _id: { type: String, required: true },
      mode: { type: String, enum: ['Require', 'Optional'] },
      title: { type: String, required: true },
      type: { type: String, enum: ['TEXT', 'IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION', 'VOTE', 'PHONE'] },
      value: { type: Schema.Types.Mixed },
      one_answer_id: { type: Schema.Types.ObjectId, ref: 'OneAnswer', require: true }
})

const formAnswer = new Schema<Form.FormAnswer.TFormAnswer>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            answers: { type: [inputData], default: [] },
            create_time: { type: Date, default: Date.now },
            form_answer_core_id: { type: Schema.Types.ObjectId, ref: 'FormAnswer', require: true }
      },
      { collection: 'formAnswerItem', timestamps: true }
)
export const oneAnswer = model('OneAnswer', formAnswer)

const formAnswerOrigin = new Schema<Form.FormAnswer.formAnswerOrigin>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            reports: { type: [{ type: Schema.Types.ObjectId, ref: 'OneAnswer' }], default: [] }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formAnswerCore = model(DOCUMENT_NAME, formAnswerOrigin)

export default formAnswerCore
