import { Document, Schema } from 'mongoose'
import { InputCore } from '~/type'

export const inputEmailSchema = new Schema<InputCore.InputEmail.InputTypeEmail>({
      type: { type: String, default: 'EMAIL' },
      input_heading: { type: String },
      input_heading_type: { type: String },
      setting: {
            type: {
                  input_error: { type: String, default: 'Email không hợp lệ', required: true },
                  placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
                  require: { type: Boolean, default: false },
                  minLength: { type: Number, default: 8 },
                  maxLength: { type: Number, default: 100 }
            }
      }
})

export const inputTextSchema = new Schema<InputCore.InputText.InputTypeText>({
      type: { type: String, default: 'TEXT' },
      input_heading: { type: String },
      input_heading_type: { type: String },
      setting: {
            type: {
                  input_error: { type: String, default: 'Nội dung không hợp lệ', required: true },
                  placeholder: { type: String, default: 'Nhập nội dung của bạn', required: true },
                  require: { type: Boolean, default: false },
                  minLength: { type: Number, default: 8 },
                  maxLength: { type: Number, default: 100 }
            }
      }
})

export const inputDateSchema = new Schema<InputCore.InputDate.InputTypeDate>({
      type: { type: String, default: 'Date' },
      date_type: { type: String, default: 'Any' },
      input_error: { type: String, default: 'Ngày không hợp lệ' },
      input_heading: { type: String },
      input_heading_type: { type: String },
      conditions: { type: { date_time: Number, require: Boolean } }
})
