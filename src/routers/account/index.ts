import { Router } from 'express'
import AccountController from '~/controllers/account.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

const routerAccount = Router()

routerAccount.use(authentication)
routerAccount.get('/me', asyncHandler(AccountController.me))

export default routerAccount
