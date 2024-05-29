import mongoose, { Document, Schema, Types, model } from 'mongoose'
import { InputCore } from '~/type'
import { inputDateSchema, inputEmailSchema, inputTextSchema } from './input.model'

const DOCUMENT_NAME = 'Form'
const COLLECTION_NAME = 'forms'

type FormInputs = InputCore.InputForm[]
export type FormBackgroundMode = 'DEFAULT' | 'CUSTOM'

type FormState = 'isDraff' | 'isPrivate' | 'isPublic'

export type FormSchema = {
      form_owner: Types.ObjectId
      form_title: string

      form_background?: {
            form_background_iamge_url: string
            form_backround_image_publicId: string
      }

      form_avatar_state: boolean
      form_background_state: boolean
      form_avatar?: {
            form_avatar_url: string
            form_avatar_publicId: string
      }

      form_setting_default: {
            form_background_default_url: string
            form_avatar_default_url: string
      }
      form_state: FormState
      form_button_label: string

      form_inputs: mongoose.Types.DocumentArray<InputCore.InputForm[]>
      expireAt?: Date
}

type FormSchemaDoc = FormSchema & Document

export const formSchema = new Schema<FormSchemaDoc>(
      {
            form_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            form_title: { type: String },
            form_avatar: { type: { form_avatar_url: String, form_avatar_publicId: String } },
            form_background: {
                  type: {
                        form_background_iamge_url: String,
                        form_backround_image_publicId: String
                  }
            },
            form_avatar_state: { type: Boolean, default: false },
            form_background_state: { type: Boolean, default: false },

            form_state: { type: String, enum: ['isDraff', 'isPublic', 'isPrivate'], default: 'isDraff' },
            form_setting_default: {
                  type: {
                        form_background_default_url: String,
                        form_avatar_default_url: String
                  },
                  default: {
                        form_background_default_url:
                              'https://res.cloudinary.com/cloud304/image/upload/v1715055931/tally_form_project/setting_default/icvxveiuj5xysby3yzco.jpg',
                        form_avatar_default_url:
                              'https://res.cloudinary.com/cloud304/image/upload/v1715055937/tally_form_project/setting_default/aanihty5eiravlosapmv.jpg'
                  }
            },
            form_inputs: { type: [inputTextSchema, inputEmailSchema, inputDateSchema] },

            form_button_label: { type: String, default: 'Submit' }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formModel = model<FormSchemaDoc>(DOCUMENT_NAME, formSchema)
export default formModel
