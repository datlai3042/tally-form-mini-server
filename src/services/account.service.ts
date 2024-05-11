import { NextFunction, Response } from 'express'
import { BadRequestError } from '~/Core/response.error'
import userModel from '~/model/user.model'
import { CustomRequest, UpdateAccount } from '~/type'
import { compare } from '~/utils/bcrypt.utils'
import { expriresAT, omit, setCookieResponse } from '~/utils/dataResponse.utils'
import { validateEmail } from '~/utils/inputsValidate'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class AccountService {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req

            const expireToken = setCookieResponse(res, expriresAT, 'test', 'success', { httpOnly: true })

            return { user }
      }

      static async updateAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            const user = req.user
            const file = req.file
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const folder = `users/${user?.id}/avatar`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            const userQueryDoc = { _id: user?._id }
            const userUpdateDoc = {
                  $set: { avatar: { secure_url: result.secure_url, public_id: result.public_id, date_update: Date.now() } }
            }
            const userOptionDoc = { new: true, upsert: true }

            const userUpdate = await userModel.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc)
            if (!userUpdate) throw new BadRequestError({ metadata: 'Unknown Error' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }

      static async updateEmail(req: CustomRequest<UpdateAccount.UpdateEmailParams>, res: Response, next: NextFunction) {
            const { user } = req

            const { user_new_email, user_password } = req.body

            const checkEmail = validateEmail(user_new_email)
            if (!checkEmail) throw new BadRequestError({ metadata: 'Email không hợp lệ' })

            const comparePassword = compare(user_password, user?.user_password as string)

            if (!comparePassword) throw new BadRequestError({ metadata: 'Password not match !!!' })

            const userQueryDoc = { _id: user?._id }
            const userUpdateDoc = {
                  $set: { user_email: user_new_email }
            }
            const userOptionDoc = { new: true, upsert: true }

            const userUpdate = await userModel.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc)

            if (!userUpdate) throw new BadRequestError({ metadata: 'Unknown Error' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }

      static async updatePassword(req: CustomRequest<UpdateAccount.UpdatePasswordParams>, res: Response, next: NextFunction) {
            const { user } = req

            const { user_password } = req.body

            const comparePassword = compare(user_password, user?.user_password as string)

            if (!comparePassword) throw new BadRequestError({ metadata: 'Password not match !!!' })

            const userQueryDoc = { _id: user?._id }
            const userUpdateDoc = {
                  $set: { user_password }
            }
            const userOptionDoc = { new: true, upsert: true }

            const userUpdate = await userModel.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc)

            if (!userUpdate) throw new BadRequestError({ metadata: 'Unknown Error' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }
}

export default AccountService
