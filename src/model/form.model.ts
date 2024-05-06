import { Document, Schema, Types, model } from 'mongoose'
import { InputCore } from '~/type'

const DOCUMENT_NAME = 'Form'
const COLLECTION_NAME = 'forms'

type FormBackgroundMode = 'IMAGE' | 'COLOR'
type FormInputs = InputCore.InputForm[]
type FormState = 'isDraff' | 'isPrivate' | 'isPublic'

export type FormSchema = {
      form_owner: Types.ObjectId
      form_title: string

      form_background?: {
            form_background_type: FormBackgroundMode
            form_background_iamge_url: string
            form_background_color_name: string
      }

      form_setting_default: {
            form_background_default_url: string
            form_background_default_width: string
            form_background_default_height: string
            form_avatar_default_url: string
            form_avatar_default_width: string
            form_avatar_default_height: string
            form_title_color: string
            form_title_textStyle: string
            form_title_fontSize: string
            form_title_href: string
      }
      form_state: FormState

      form_avatar?: {
            form_avatar_url: string
      }
      form_inputs: FormInputs
      expireAt?: Date
}

type FormSchemaDoc = FormSchema & Document

export const formSchema = new Schema<FormSchemaDoc>(
      {
            form_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            form_title: { type: String },
            form_avatar: { type: { form_avatar_url: String } },
            form_background: {
                  type: {
                        form_background_type: {
                              type: String,
                              enum: ['IMAGE', 'COLOR'],
                              default: 'IMAGE'
                        },
                        form_background_iamge_url: String,
                        form_background_color_name: String
                  }
            },
            form_state: { type: String, enum: ['isDraff', 'isPublic', 'isPrivate'], default: 'isDraff' },
            form_setting_default: {
                  type: {
                        form_background_default_url: String,
                        form_background_default_width: String,
                        form_background_default_height: String,
                        form_avatar_default_url: String,
                        form_avatar_default_width: String,
                        form_avatar_default_height: String,
                        form_title_color: String,
                        form_title_textStyle: String,
                        form_title_fontSize: String,
                        form_title_href: String
                  },
                  default: {
                        form_background_default_url: '',
                        form_background_default_width: '',
                        form_background_default_height: '',
                        form_avatar_default_url: '',
                        form_avatar_default_width: '',
                        form_avatar_default_height: ''
                  }
            },
            form_inputs: { type: Schema.Types.Mixed, default: [] }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formModel = model<FormSchemaDoc>(DOCUMENT_NAME, formSchema)
export default formModel
