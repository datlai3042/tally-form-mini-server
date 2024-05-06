import { Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
import AccountController from '~/controllers/account.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

const accountRouter = Router()

accountRouter.use(authentication)

accountRouter.post('/update-avatar', upload.single('file'), asyncHandler(AccountController.updateAvatar))
accountRouter.post('/update-email', asyncHandler(AccountController.updateEmail))
accountRouter.post('/update-password', asyncHandler(AccountController.updatePassword))

accountRouter.get('/me', asyncHandler(AccountController.me))

export default accountRouter
