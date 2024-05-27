import { Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
import AccountController from '~/controllers/account.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerAccount = Router()

routerAccount.use(authentication)

routerAccount.post('/update-avatar', upload.single('file'), asyncHandler(AccountController.updateAvatar))
routerAccount.post('/update-email', asyncHandler(AccountController.updateEmail))
routerAccount.post('/update-password', asyncHandler(AccountController.updatePassword))

routerAccount.get('/me', asyncHandler(AccountController.me))

export default routerAccount
