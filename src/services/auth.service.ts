import { NextFunction, Response } from 'express'
import { AuthFailedError, BadRequestError, NotFoundError, ResponseError } from '~/Core/response.error'
import keyManagerModel from '~/model/keyManager.model'
import { notificationModel } from '~/model/notification.model'
import userModel, { UserDocument } from '~/model/user.model'
import { CustomRequest, OAuth, Token } from '~/type'
import { compare, hassPassword } from '~/utils/bcrypt.utils'
import { expriresAT, omit, oneWeek, setCookieResponse } from '~/utils/dataResponse.utils'
import createANotification from '~/utils/notification'
import { getGoogleUser, getOAuthGoogleToken } from '~/utils/oAuth'
import { createPayload, fillDataKeyModel, generateCodeVerifyToken, generatePaidKey, generatePaidToken } from '~/utils/token.utils'

type AuthParam = {
      email: string
      password: string
      first_name: string
      last_name: string
}

class AuthService {
      static async register(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password, first_name, last_name } = req.body

            if (!email || !password || !first_name || !last_name) throw new AuthFailedError({ metadata: 'Request thiếu các field bắt buốc' })

            const foundEmail = await userModel.findOne({ user_email: email })
            if (foundEmail) throw new AuthFailedError({ metadata: 'Email đã tồn tại' })

            const hashPassword = await hassPassword(password)

            const user_atlas = email.split('@')[0]

            const createUser = await userModel.create({
                  user_email: email,
                  user_password: hashPassword,
                  user_first_name: first_name,
                  user_last_name: last_name,
                  user_auth: 'email',
                  user_password_state: true,
                  user_atlas
            })
            if (!createUser) throw new ResponseError({ metadata: 'Không thể đăng kí user do lỗi' })

            const { private_key, public_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

            const payload = createPayload(createUser)

            const token = generatePaidToken<Token.PayloadJWT>(payload, { public_key, private_key })
            const code_verify_token = generateCodeVerifyToken()

            const { modelKeyQuery, modelKeyUpdate, modelKeyOption } = fillDataKeyModel(
                  createUser,
                  public_key,
                  private_key,
                  token.refresh_token,
                  code_verify_token
            )

            const createKey = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)
            if (!createKey) throw new ResponseError({ metadata: 'Server không thể tạo model key' })

            const createNotification = await createANotification({ user_id: createUser?._id, type: 'System', core: { message: 'Cảm ơn bạn đã tạo tài khoản' } })

            setCookieResponse(res, oneWeek, 'client_id', createUser._id.toString(), { httpOnly: true })
            setCookieResponse(res, oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true })
            setCookieResponse(res, expriresAT, 'access_token', token.access_token, { httpOnly: true })
            const expireToken = setCookieResponse(res, oneWeek, 'refresh_token', token.refresh_token, { httpOnly: true })

            return {
                  user: omit(createUser.toObject(), ['user_password']),
                  token: { access_token: token.access_token, refresh_token: token.refresh_token, code_verify_token },
                  expireToken,
                  client_id: createUser._id
            }
      }

      static async login(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password } = req.body
            const foundUser = await userModel.findOne({ user_email: email })
            if (!foundUser) throw new AuthFailedError({ metadata: 'Không tìm thấy thông tin tài khoản' })

            const checkPassword = compare(password, foundUser?.user_password)
            if (!checkPassword) throw new AuthFailedError({ metadata: 'Không tin tài khoản không chính xác' })

            const foundKey = await keyManagerModel.findOneAndDelete({ user_id: foundUser._id })

            const { public_key, private_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

            const payload = createPayload(foundUser)
            const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
            const code_verify_token = generateCodeVerifyToken()

            const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(foundUser, public_key, private_key, refresh_token, code_verify_token)
            const keyStore = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)

            if (!keyStore) throw new ResponseError({ metadata: 'Server không thể tạo model key' })
            const createNotification = await createANotification({ user_id: foundUser?._id, type: 'System', core: { message: 'Chào mừng bạn quay trở lại' } })

            setCookieResponse(res, oneWeek, 'client_id', foundUser._id.toString(), { httpOnly: true })
            setCookieResponse(res, oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true })

            const expireToken = setCookieResponse(res, oneWeek, 'refresh_token', refresh_token, { httpOnly: true })
            setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })
            return {
                  user: omit(foundUser.toObject(), ['user_password']),
                  token: { access_token, refresh_token, code_verify_token },

                  expireToken,
                  client_id: foundUser._id
            }
      }

      static async logout(req: CustomRequest, res: Response, next: NextFunction) {
            const user = req.user as UserDocument
            const { force } = req.body
            const createNotification = await createANotification({ user_id: user?._id, type: 'System', core: { message: 'Đăng xuất thành công' } })

            res.clearCookie('client_id')
            res.clearCookie('refresh_token')
            res.clearCookie('code_verify_token')
            res.clearCookie('access_token')
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
            const code_verify_token = generateCodeVerifyToken()

            const keyModelQuery = { user_id: user._id }
            const keyModelUpdate = {
                  $set: { refresh_token: new_refresh_token, private_key, public_key, code_verify_token },
                  $addToSet: { refresh_token_used: refresh_token }
            }
            const keyModelOption = { new: true, upsert: true }

            const updateKeyModel = await keyManagerModel.findOneAndUpdate(keyModelQuery, keyModelUpdate, keyModelOption)

            const expireToken = setCookieResponse(res, oneWeek, 'refresh_token', new_refresh_token, { httpOnly: true })
            setCookieResponse(res, oneWeek, 'client_id', user._id.toString(), { httpOnly: true })
            setCookieResponse(res, oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true })

            setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })
            return {
                  user: omit(user.toObject(), ['user_password']),
                  token: { access_token, refresh_token: new_refresh_token, code_verify_token },
                  expireToken,
                  client_id: user._id.toString()
            }
      }

      static async oAuthWithGoogle(req: CustomRequest<object, { code: string }>, res: Response, next: NextFunction) {
            const { code } = req.query
            const data: { id_token: string; access_token: string } = await getOAuthGoogleToken({ code })

            const { id_token, access_token: access_token_google } = data

            const google_user: OAuth.Google.GoogleUserData = await getGoogleUser({ id_token, access_token: access_token_google })

            if (!google_user.verified_email) {
                  throw new BadRequestError({ metadata: 'Email Không hợp lệ' })
            }

            console.log({ email: google_user.email })

            const { public_key, private_key } = generatePaidKey()
            if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

            const found_user_system = await userModel.findOne({ user_email: google_user.email })
            if (found_user_system) {
                  await keyManagerModel.findOneAndDelete({ user_id: found_user_system._id })

                  const payload = createPayload(found_user_system)
                  const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
                  const code_verify_token = generateCodeVerifyToken()

                  const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(
                        found_user_system,
                        public_key,
                        private_key,
                        refresh_token,
                        code_verify_token
                  )
                  const keyStore = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)

                  if (!keyStore) throw new ResponseError({ metadata: 'Server không thể tạo model key' })
                  setCookieResponse(res, oneWeek, 'client_id', found_user_system._id.toString(), { httpOnly: true })
                  setCookieResponse(res, oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true })

                  const expireToken = setCookieResponse(res, oneWeek, 'refresh_token', refresh_token, { httpOnly: true })
                  setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })
                  const url_client = process.env.MODE === 'DEV' ? 'http://localhost:3000/oauth-google' : process.env.CLIENT_URL + '/oauth-google'
                  const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${found_user_system._id}`
                  res.redirect(url_full)
            }

            const { email, family_name, given_name, picture } = google_user

            const hashPassword = await hassPassword(process.env.KEY_PASSWORD as string)

            const user_atlas = email.split('@')[0]

            const user_data = {
                  user_email: email,
                  user_first_name: given_name,
                  user_last_name: family_name,
                  user_avatar_current: picture,
                  user_auth: 'oAuth',
                  user_password: hashPassword,
                  user_roles: 'USER',
                  user_gender: 'MALE',
                  user_atlas
            }

            const create_user = await userModel.create(user_data)

            const payload = createPayload(create_user)
            const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
            const code_verify_token = generateCodeVerifyToken()

            const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(create_user, public_key, private_key, refresh_token, code_verify_token)
            const keyStore = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)

            setCookieResponse(res, oneWeek, 'client_id', create_user._id.toString(), { httpOnly: true })
            setCookieResponse(res, oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true })

            const expireToken = setCookieResponse(res, oneWeek, 'refresh_token', refresh_token, { httpOnly: true })
            setCookieResponse(res, expriresAT, 'access_token', access_token, { httpOnly: true })

            const url_client = process.env.MODE === 'DEV' ? 'http://localhost:3000/oauth-google' : process.env.CLIENT_URL + '/oauth-google'
            const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${create_user._id}`
            res.redirect(url_full)
      }
}

export default AuthService
