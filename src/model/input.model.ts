import { Document, Schema } from 'mongoose'
import { InputCore } from '~/type'

export const inputEmailSchema = new Schema<InputCore.InputEmail.InputTypeEmail>({
      type: { type: String, default: 'EMAIL' },
      input_error: { type: String, default: 'Email không hợp lệ', required: true },
      input_heading: { type: String },
      input_heading_type: { type: String },
      placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
      conditions: {
            type: { email_min_length: Number, enail_max_length: Number, require: Boolean },
            default: { email_min_length: 8, enail_max_length: 100, require: false }
      }
})

export const inputTextSchema = new Schema<InputCore.InputText.InputTypeText>({
      type: { type: String, default: 'TEXT' },
      input_error: { type: String, default: 'Đã xảy ra lỗi ngoài ý muốn', required: true },
      input_heading: { type: String },
      input_heading_type: { type: String },
      placeholder: { type: String, default: 'Nhập đoạn văn bạn muốn nhập', required: true },
      conditions: {
            type: { text_min_length: Number, text_max_length: Number, require: Boolean },
            default: { text_min_length: 8, text_max_length: 100, require: false }
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
