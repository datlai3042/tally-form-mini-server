import { Request } from 'express'
import { UserDocument } from './model/user.model'
import { KeyManagerDocument } from './model/keyManager.model'
import { ObjectId } from 'mongoose'

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
      error: any
}

export type ResSucess = {
      code?: number
      message?: string
      metadata: any
}

export type ResError = {
      code?: number
      message?: string
      detail: string
}

export type Key = {
      public_key: string
      private_key: string
}

export type Token = {
      access_token: string
      refresh_token: string
}

export type PayloadJWT = {
      _id: Types.ObjectId
      user_email: string
      user_roles: string
}
