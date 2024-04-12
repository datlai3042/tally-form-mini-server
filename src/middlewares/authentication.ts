import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import { AuthFailedError, BadRequestError, NotFoundError } from '~/Core/response.error'
import { asyncHandler } from '~/helpers/asyncHandler'
import keyManagerModel from '~/model/keyManager.model'
import userModel from '~/model/user.model'
import { CustomRequest } from '~/type'
import { verifyAccessToken, verifyRefreshToken } from '~/utils/token.utils'

interface IHEADER {
      CLIENT_ID: string
      AUTHORIZATION: string
}

export const HEADER: IHEADER = {
      CLIENT_ID: 'x-client-id',
      AUTHORIZATION: 'authorization'
}

const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
      const client_id = req.headers[HEADER.CLIENT_ID] as string
      console.log({ client_id, req })
      if (!client_id) throw new BadRequestError({ metadata: 'CLIENT::Không truyền user_id' })

      const access_token = req.headers[HEADER.AUTHORIZATION] as string
      if (!access_token) throw new NotFoundError({ metadata: 'Không tìm thấy access_token' })
      console.log({ url: req.originalUrl, access_token })

      const user = await userModel.findOne({ _id: new Types.ObjectId(client_id) })
      if (!user) throw new NotFoundError({ metadata: 'Không tìm thấy user' })

      const keyStore = await keyManagerModel.findOne({ user_id: user._id })
      if (!keyStore) throw new NotFoundError({ metadata: 'Không tìm thấy key của user' })

      const force = req.body.force
      if (force) {
            req.user = user
            return next()
      }

      //CASE: Auth refresh_token
      if (req.originalUrl === '/v1/api/auth/refresh-token') {
            const refresh_token = req.cookies['refresh_token']
            if (!refresh_token) return next(new AuthFailedError({ metadata: 'Không tìm thấy refresh_token' }))
            return verifyRefreshToken({ client_id, user, keyStore, token: refresh_token, key: keyStore.private_key, req, res, next })
      }

      //CASE: Auth access_token
      if (access_token) {
            const token = access_token.split(' ')[1]
            return verifyAccessToken({ client_id, user, keyStore, token, key: keyStore.public_key, req, res, next })
      }
})

export default authentication
