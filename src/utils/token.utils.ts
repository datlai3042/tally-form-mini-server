import { randomBytes } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthFailedError, BadRequestError, ForbiddenError, ResponseError } from '~/Core/response.error'
import { KeyManagerDocument } from '~/model/keyManager.model'
import { UserDocument } from '~/model/user.model'
import { CustomRequest, Key, PayloadJWT, Token } from '~/type'

export const generatePaidToken = <PayloadJWT extends object>(payload: PayloadJWT, key: Key): Token => {
      const access_token = jwt.sign(payload, key.public_key, { expiresIn: '10s' })
      const refresh_token = jwt.sign(payload, key.private_key, { expiresIn: '7d' })
      if (!access_token || !refresh_token) throw new ResponseError({ metadata: 'Lỗi do tạo key' })
      return { access_token, refresh_token }
}

export const generatePaidKey = (): Key => {
      const public_key = randomBytes(64).toString('hex')
      const private_key = randomBytes(64).toString('hex')
      return { public_key, private_key }
}

/**
 *
 * @returns Tạo mã xác thực refresh_token dùng 1 lần
 */
export const generateCodeVerifyToken = (): string => {
      const code_verify_refresh_token = randomBytes(20).toString('hex')
      return code_verify_refresh_token
}

export const createPayload = (user: UserDocument) => {
      const { _id, user_email, user_roles } = user

      const payload = {
            _id,
            user_email,
            user_roles
      }

      return payload
}

export type ParamVerifyAT = {
      user: UserDocument
      keyStore: KeyManagerDocument
      client_id: string
      token: string
      key: string
      req: CustomRequest
      res: Response
      next: NextFunction
}
export const verifyAccessToken = ({ user, keyStore, client_id, token, key, req, res, next }: ParamVerifyAT) => {
      jwt.verify(token, key, (error, decode) => {
            if (error) {
                  if (req.originalUrl === '/v1/api/auth/logout') {
                        req.user = user
                        return next()
                  }
                  return next(new AuthFailedError({ metadata: 'Token không đúng' }))
            }

            const payload = decode as PayloadJWT
            if (payload._id !== client_id) return next(new BadRequestError({ metadata: 'Token không thuộc về user' }))
            req.user = user
            req.keyStore = keyStore
      })
      return next()
}

export const verifyRefreshToken = ({ user, keyStore, client_id, token, key, req, res, next }: ParamVerifyAT) => {
      const force = req.body.force

      jwt.verify(token, key, (error, decode) => {
            if (error) {
                  return next(new ForbiddenError({ metadata: 'Token không đúng123' }))
            }
            const payload = decode as PayloadJWT
            if (payload._id !== client_id) return next(new BadRequestError({ metadata: 'Token không thuộc về user' }))
            req.user = user
            req.keyStore = keyStore
            req.refresh_token = token
            return next()
      })
}

export const fillDataKeyModel = (user: UserDocument, public_key: string, private_key: string, refresh_token: string) => {
      const modelKeyQuery = {
            user_id: user?._id
      }

      const modelKeyUpdate = {
            $set: { public_key, private_key, refresh_token }
      }

      const modelKeyOption = { new: true, upsert: true }

      return { modelKeyQuery, modelKeyUpdate, modelKeyOption }
}
