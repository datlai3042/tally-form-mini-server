import { Request } from 'express'
import { UserDocument } from './model/user.model'
import { KeyManagerDocument } from './model/keyManager.model'
import mongoose, { ObjectId, Schema, Types } from 'mongoose'
import { FormSchema } from './model/form.model'

export declare global {
      declare module globalThis {
            // eslint-disable-next-line no-var
            var _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
      }
}

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
            input_title: string
            _id: Types.ObjectId
      }

      type InputSettingTextCommon = {
            minLength: number
            maxLength: number
            placeholder?: string
      } & InputSettingCommon

      type InputSettingCommon = {
            _id: Types.ObjectId
            input_color: string
            input_size: number
            input_style: string
            input_error: string
            require: boolean
      }

      type InputSettingOption = InputSettingCommon
      namespace InputEmail {
            export interface InputTypeEmail extends InputCore.InputCommon {
                  type: 'EMAIL'
                  input_value: string
                  core: Core.Text
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
                  core: Core.Text
            }
      }

      namespace InputOption {
            type InputOption = 'OPTION'

            type InputTypeOption = InputCore.InputCommon & {
                  type: InputOption
                  core: Core.Option
            }
      }

      namespace InputOptionMultiple {
            export type InputTypeOptionMultiple = InputCore.InputCommon & { type: 'OPTION_MULTIPLE'; core: Core.Option }
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

      namespace InputVote {
            type InputVote = 'VOTE'

            type InputTypeVote = InputCore.InputCommon & {
                  type: InputVote
                  core: Core.Vote
            }
      }

      namespace InputVote {
            type InputVote = 'VOTE'

            type InputTypeVote = InputCore.InputCommon & {
                  type: InputVote
                  core: Core.Vote
            }
      }

      namespace InputPhone {
            type InputPhone = 'PHONE'

            type InputTypePhone = InputCore.InputCommon & {
                  type: InputPhone
                  core: Core.Phone
            }
      }

      type InputForm =
            | InputText.InputTypeText
            | InputEmail.InputTypeEmail
            | InputVote.InputTypeVote
            | InputOption.InputTypeOption
            | InputPhone.InputTypePhone
            // | InputDate.InputTypeDate
            | InputOptionMultiple.InputTypeOptionMultiple
      // | InputImage.InputTypeImage
}

namespace Core {
      type CoreCommon = Text | Option | Vote

      type Setting = {
            input_color: string
            input_size: number
            input_style: string
            input_error: string
            require: boolean
      }

      type Text = {
            setting: Core.Setting & {
                  minLength: number
                  maxLength: number
                  placeholder?: string
            }
      }

      type Option = { setting: Core.Setting; options: { option_id: string; option_value: string }[] }
      type Vote = { setting: Core.Setting }
      type Phone = { setting: Core.Setting }
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
            form: FormSchema & { _id: string; input_id: string }
      }

      export type FindFormParams = {
            form_id: string
      }
}

namespace Form {
      type FormCore = FormSchema & { _id: string }
      namespace FormAnswer {
            type InputFormRequire = { _id?: string; title?: string; checkRequire: boolean }
            type InputFormData = {
                  _id: Types.ObjectId | string
                  title: string
                  mode: 'Require' | 'Optional'
                  value: string
                  type: 'TEXT' | 'EMAIL' | 'IMAGE' | 'OPTION' | 'OPTION_MULTIPLE' | 'PHONE' | 'VOTE'
            }

            type TFormAnswer = {
                  form_id: Types.ObjectId
                  answers: InputFormData[]
                  create_time: Date
            }

            type formAnswerOrigin = {
                  form_id: Types.ObjectId
                  owner_id: Types.ObjectId
                  reports: TFormAnswer[]
            }
      }
}

namespace Notification {
      namespace Type {
            type System = 'System'
            type FormAnswers = 'Form_Answers'
            type Account = 'Account'

            type Common = System | FormAnswers | Account
      }

      namespace Core {
            type System = {
                  message: string
            }

            type FormAnswers = {
                  message: string
                  form_id: string
                  form_answer_id: string
                  create_time: string
            }

            type Account = {
                  message: string
            }

            type Common = System | FormAnswers | Account
      }

      namespace System {
            type NotificationSystem = Notification.Commom.TCommon & {
                  type: Type.System
                  core: Core.System
            }
      }

      namespace Account {
            type NotificationAccount = Notification.Commom.TCommon & {
                  type: Type.Account
                  core: Core.Account
            }
      }

      namespace FormAnswers {
            type NotificationFormAnswers = Notification.Commom.TCommon & {
                  type: Type.FormAnswers
                  core: Core.FormAnswers
            }
      }

      namespace Commom {
            type TCommon = {
                  _id: Types.ObjectId
                  create_time: Date
            }
      }

      type NotifcationCore = System.NotificationSystem | Account.NotificationAccount | FormAnswers.NotificationFormAnswers
}

namespace OAuth {
      namespace Google {
            type GoogleUserData = {
                  id: string
                  email: string
                  verified_email: boolean
                  name: string
                  given_name: string
                  family_name: string
                  picture: string
            }
      }
}
