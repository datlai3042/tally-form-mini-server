import { Request } from 'express'
import { UserDocument } from './model/user.model'
import { KeyManagerDocument } from './model/keyManager.model'
import { ObjectId } from 'mongoose'
import { FormSchema } from './model/form.model'

export interface CustomRequest<Body = any> extends Request {
      user?: UserDocument
      keyStore?: KeyManagerDocument
      refresh_token?: string
      force?: boolean
      router?: string
      body: Body
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
      export type Input = {
            input_title: string
            input_errors: string
            input_value: string
      }

      export type InputDateTimeAny = { date_type: 'Any'; date_time: number }
      export type InputDateTimeBefore = { date_type: 'Before'; date_time: number }
      export type InputDateTimeAfter = { date_type: 'After'; date_time: number }
      export type InputDateTimeBetween = { date_type: 'Between'; date_time_1: number; date_time_2: number }

      export type InputDateTime = InputDateTimeAny | InputDateTimeBefore | InputDateTimeAfter | InputDateTimeBetween
      export type InputText = 'Email' | 'Number'
      export type InputTypeText = Input & { type: InputText; placeholder: string }
      export type InputTypeOption = Input & { type: 'Option'; option: string[] }
      export type InputTypeDate = Omit<Input, 'input_value'> & InputDateTime & { type: 'Date' }
      export type InputTypeImage = { type: 'IMAGE'; caption: string; alt: string; url: string }
      export type InputForm = InputTypeText | InputTypeOption | InputTypeDate | InputTypeImage
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
            form_id: string
            form_update: FormSchema
      }

      export type FindFormParams = {
            form_id: string
      }
}
