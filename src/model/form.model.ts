import mongoose, { Document, Schema, Types, model } from 'mongoose'
import { Form, InputCore } from '~/type'
import { inputCoreSchema } from './input.model'
import { formTitleSubSchema } from './form_title.model'

const DOCUMENT_NAME = 'Form'
const COLLECTION_NAME = 'forms'

type FormInputs = InputCore.InputForm[]
export type FormBackgroundMode = 'DEFAULT' | 'CUSTOM'

export type FormState = 'isPrivate' | 'isPublic' | 'isDelete'
type FormTextStyle = 'normal' | 'italic'
type FormAvatarPosition = 'left' | 'center' | 'right'
type FormAvatarMode = 'circle' | 'square'
export type FormModeDisplay = 'basic' | 'custom'

export type FormSchema = {
      form_owner: Types.ObjectId

      form_background?: {
            backgroundColor?: string
            form_background_iamge_url: string
            form_backround_image_publicId: string
            mode_show: 'cover' | 'contain'
            form_background_position: {
                  x: number
                  y: number
            }

            padding: {
                  x: number
                  y: number
            }
      }

      form_title?: {
            form_title_style?: FormTextStyle
            form_title_value: string
            form_title_color?: string
            form_title_size?: number
            form_title_mode_image: 'Normal' | 'Slider'
            form_title_sub: Form.FormTitle.FormTitleBase[]
      }

      form_avatar_state: boolean
      form_background_state: boolean
      form_avatar?: {
            form_avatar_url: string
            form_avatar_publicId: string
            position: FormAvatarPosition
            mode_shape: FormAvatarMode
      }

      form_mode_display: FormModeDisplay

      form_setting_default: {
            form_background_default_url: string
            form_background_position_default: {
                  x: number
                  y: number
            }
            form_avatar_default_postion: FormAvatarPosition
            form_avatar_default_url: string
            form_avatar_default_mode: FormAvatarMode
            form_title_color_default?: string
            form_title_size_default: number
            form_title_style_default: string
            input_color: string
            input_size: number
            input_style: string
      }
      form_state: FormState
      form_button_label: string

      form_inputs: mongoose.Types.DocumentArray<InputCore.InputCommon[]>
      expireAt?: Date
}

type FormSchemaDoc = FormSchema & Document

export const formSchema = new Schema<FormSchemaDoc>(
      {
            form_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            form_avatar: {
                  type: {
                        form_avatar_url: String,
                        form_avatar_publicId: String,
                        position: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
                        mode_shape: { type: String, enum: ['circle', 'square'], default: 'circle' }
                  }
            },
            form_title: {
                  type: {
                        form_title_color: { type: String },
                        form_title_size: { type: Number, max: 40 },
                        form_title_style: { type: String },
                        form_title_value: { type: String },
                        form_title_sub: { type: [formTitleSubSchema] },
                        form_title_mode_image: { type: String }
                  },
                  default: {
                        form_title_color: '#2568aa',
                        form_title_size: 24,
                        form_title_style: 'normal',
                        form_title_value: '',
                        form_title_mode_image: 'Normal',
                        form_title_sub: []
                  }
            },
            form_background: {
                  type: {
                        backgroundColor: String,
                        form_background_iamge_url: String,
                        form_backround_image_publicId: String,
                        mode_show: { type: String, enum: ['cover', 'contain'], default: 'cover' },
                        form_background_position: {
                              x: Number,
                              y: Number
                        },
                        padding: {
                              x: { type: Number, default: 0 },
                              y: { type: Number, default: 0 }
                        }
                  }
            },
            form_avatar_state: { type: Boolean, default: false },
            form_background_state: { type: Boolean, default: false },
            form_state: { type: String, enum: ['isPublic', 'isPrivate', 'isDelete'], default: 'isPrivate' },
            form_mode_display: { type: String, enum: ['basic', 'custom'], default: 'basic' },

            form_setting_default: {
                  type: {
                        form_avatar_default_postion: String,
                        form_background_default_url: String,
                        form_avatar_default_url: String,
                        form_title_color_default: String,
                        form_title_size_default: Number,
                        form_title_style_default: String,
                        form_avatar_default_mode: String,
                        form_background_position_default: {
                              x: Number,
                              y: Number
                        },
                        input_color: String,
                        input_size: { type: Number, max: 24 },
                        input_style: String
                  },
                  default: {
                        form_avatar_default_postion: 'left',
                        form_background_position_default: {
                              x: 0,
                              y: 0
                        },
                        form_avatar_default_mode: 'circle',
                        input_color: '#000000',
                        input_size: 14,
                        input_style: 'normal',
                        form_title_color_default: '#2568aa',
                        form_title_size_default: 24,
                        form_title_style_default: 'normal',
                        form_background_default_url:
                              'https://res.cloudinary.com/cloud304/image/upload/v1715055931/tally_form_project/setting_default/icvxveiuj5xysby3yzco.jpg',
                        form_avatar_default_url:
                              'https://res.cloudinary.com/cloud304/image/upload/v1715055937/tally_form_project/setting_default/aanihty5eiravlosapmv.jpg'
                  }
            },
            form_inputs: [inputCoreSchema],

            form_button_label: { type: String, default: 'Submit' }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formModel = model<FormSchemaDoc>(DOCUMENT_NAME, formSchema)
export default formModel
