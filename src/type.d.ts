import { Request } from 'express'
import { UserDocument } from './model/user.model'
import { KeyManagerDocument } from './model/keyManager.model'
import { ObjectId } from 'mongoose'
import { FormSchema } from './model/form.model'

export interface CustomRequest<Body = any, Query = any> extends Request {
      user?: UserDocument
      keyStore?: KeyManagerDocument
      refresh_token?: string
      force?: boolean
      router?: string
      body: Body
      query: Query
}

interface ErrorServer extends Error {
      code?: number
      detail?: string
      metadata: any
}

namespace Http {
      export type ResSucess = {
            code?: number
            message?: string
            metadata: any
      }

      export type ResError = {
            code?: number
            message?: string
            metadata: string | any
      }
}

namespace Token {
      export type Key = {
            public_key: string
            private_key: string
      }

      export type PairToken = {
            access_token: string
            refresh_token: string
      }

      export type PayloadJWT = {
            _id: Types.ObjectId
            user_email: string
            user_roles: string
      }
}

namespace InputCore {
      export type InputCommon = {
            input_heading: string
            input_heading_type: 'LABEL' | 'TITLE'

            _id: string
      }

      type InputSettingTextCommon = {
            minLength: number
            maxLength: number
      } & InputSettingCommon

      type InputSettingCommon = {
            placeholder?: string
            input_color: string
            input_size: number
            input_style: string
            input_error: string
            require: boolean
      }
      namespace InputEmail {
            export interface InputTypeEmail extends InputCore.InputCommon {
                  type: 'EMAIL'
                  input_value: string
                  setting?: InputCore.InputSettingTextCommon
            }

            export interface InputEmailSender extends InputTypeEmail {
                  input_value: string
            }
      }

      namespace InputDate {
            export type InputDateTimeAny = {
                  type: 'Date'
                  date_type: 'Any'
                  conditions: {
                        date_time: number
                        require: boolean
                  }
            }
            export type InputDateTimeBefore = {
                  type: 'Date'
                  date_type: 'Before'
                  setting?: {
                        require: boolean
                        placeholder?: string
                        minLength: boolean
                        maxLength: boolean
                        input_error?: string
                  }
            }
            export type InputDateTimeAfter = {
                  type: 'Date'
                  date_type: 'After'
                  setting?: {
                        require: boolean
                        placeholder?: string
                        minLength: boolean
                        maxLength: boolean
                        input_error?: string
                  }
            }
            export type InputDateTimeBetween = { type: 'Date'; date_type: 'Between'; date_time_1: number; date_time_2: number }

            export type InputDateTime = InputDateTimeAny | InputDateTimeBefore | InputDateTimeAfter | InputDateTimeBetween
            export type InputTypeDate = InputDateTime & InputCore.InputCommon
      }

      namespace InputText {
            export type InputText = 'TEXT'
            export type InputTypeText = InputCore.InputCommon & {
                  type: InputText
                  setting: InputSettingTextCommon
            }
      }

      namespace InputOption {
            export type InputTypeOption = InputCore.InputCommon & { type: 'Option'; option: string[]; conditions: { require: true } }
      }

      namespace InputImage {
            export type InputTypeImage = InputCore.InputCommon & {
                  type: 'IMAGE'
                  caption: string
                  alt: string
                  url: string
                  secure_url: string
                  public_id: string
                  conditions: { require: true }
            }
      }

      export type InputForm =
            | InputText.InputTypeText
            | InputEmail.InputTypeEmail
            | InputOption.InputTypeOption
            | InputDate.InputTypeDate
            | InputImage.InputTypeImage
}

namespace UpdateAccount {
      export type UpdateEmailParams = {
            user_password: string
            user_new_email: string
      }

      export type UpdatePasswordParams = {
            user_password: string
      }
}

namespace FormEdit {
      export type FormEditParams = {
            form: FormSchema & { _id: string }
      }

      export type FindFormParams = {
            form_id: string
      }
}
