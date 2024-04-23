import { NextFunction, Response } from 'express'
import { AuthFailedError, BadRequestError, NotFoundError, ResponseError } from '~/Core/response.error'
import { HEADER } from '~/middlewares/authentication'
import keyManagerModel from '~/model/keyManager.model'
import userModel, { UserDocument } from '~/model/user.model'
import { CustomRequest, PayloadJWT } from '~/type'
import { compare, hassPassword } from '~/utils/bcrypt.utils'
import { expriresAT, omit, oneWeek, setCookieResponse } from '~/utils/dataResponse.utils'
import { createPayload, fillDataKeyModel, generatePaidKey, generatePaidToken } from '~/utils/token.utils'

type AuthParam = {
      email: string
      password: string
      first_name: string
      last_name: string
}

class AuthService {
      static async register(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password, first_name, last_name } = req.body

            if (!email || !password || !first_name || !last_name) throw new BadRequestError({ metadata: 'Missing Field' })

            const foundEmail = await userModel.findOne({ user_email: email })
            if (foundEmail) throw new BadRequestError({ metadata: 'Email đã tồn tại' })

            const hashPassword = await hassPassword(password)

            const createUser = await userModel.create({
                  user_email: email,
                  user_password: hashPassword,
                  user_first_name: first_name,
                  user_last_name: last_name
            })
            if (!createUser) throw new ResponseError({ metadata: 'Không thể đăng kí user do lỗi' })

            const { private_key, public_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

            const payload = createPayload(createUser)

            const token = generatePaidToken<PayloadJWT>(payload, { public_key, private_key })

            const { modelKeyQuery, modelKeyUpdate, modelKeyOption } = fillDataKeyModel(createUser, public_key, private_key, token.refresh_token)

            const createKey = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)
            if (!createKey) throw new ResponseError({ metadata: 'Server không thể tạo model key' })

            setCookieResponse(res, oneWeek, 'refresh_token', token.refresh_token, { httpOnly: true })
            setCookieResponse(res, oneWeek, 'client_id', createUser._id.toString(), { httpOnly: true })

            const expireToken = setCookieResponse(res, expriresAT, 'access_token', token.access_token, { httpOnly: true })
            return {
                  user: omit(createUser.toObject(), ['user_password']),
                  token: { access_token: token.access_token, refresh_token: token.refresh_token },
                  expireToken,
                  client_id: createUser._id
            }
      }

      static async login(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password } = req.body

            const foundUser = await userModel.findOne({ user_email: email })
            if (!foundUser) throw new NotFoundError({ metadata: 'Không tìm thấy user' })

            const checkPassword = compare(password, foundUser?.user_password)
            if (!checkPassword) throw new AuthFailedError({ metadata: 'Something wrongs...' })

            const access_token_old = req.headers[HEADER.AUTHORIZATION]
            if (access_token_old) {
                  await keyManagerModel.findOneAndDelete({ user_id: foundUser._id })
            }

            const { public_key, private_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

            const payload = createPayload(foundUser)
            const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })

            const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(foundUser, public_key, private_key, refresh_token)
            const keyStore = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)
            if (!keyStore) throw new ResponseError({ metadata: 'Server không thể tạo model key' })
            setCookieResponse(res, oneWeek, 'client_id', foundUser._id.toString(), { httpOnly: true })

            setCookieResponse(res, oneWeek, 'refresh_token', refresh_token, { httpOnly: true })
            const expireToken = setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })
            return {
                  user: omit(foundUser.toObject(), ['user_password']),
                  token: { access_token, refresh_token },
                  expireToken,
                  client_id: foundUser._id
            }
      }

      static async logout(req: CustomRequest, res: Response, next: NextFunction) {
            const user = req.user as UserDocument
            const { force } = req.body
            if (force) {
                  await keyManagerModel.findOneAndDelete({ user_id: user._id })
                  return { message: 'Token hết hạn và đẵ buộc phải logout', force }
            }
            await keyManagerModel.findOneAndDelete({ user_id: user._id })
            return { message: 'Logout thành công' }
      }

      static async refresh_token(req: CustomRequest, res: Response, next: NextFunction) {
            const { refresh_token } = req
            const user = req.user as UserDocument
            const { public_key, private_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })
            const payload = createPayload(user)

            const { access_token, refresh_token: new_refresh_token } = generatePaidToken(payload, { public_key, private_key })

            const keyModelQuery = { user_id: user._id }
            const keyModelUpdate = { $set: { refresh_token: new_refresh_token, private_key, public_key }, $addToSet: { refresh_token_used: refresh_token } }
            const keyModelOption = { new: true, upsert: true }

            const updateKeyModel = await keyManagerModel.findOneAndUpdate(keyModelQuery, keyModelUpdate, keyModelOption)

            setCookieResponse(res, oneWeek, 'refresh_token', new_refresh_token, { httpOnly: true })
            setCookieResponse(res, oneWeek, 'client_id', user._id, { httpOnly: true })

            const expireToken = setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })
            return {
                  user: omit(user.toObject(), ['user_password']),
                  token: { access_token, refresh_token: new_refresh_token },
                  expireToken,
                  client_id: user._id
            }
      }
}

export default AuthService
