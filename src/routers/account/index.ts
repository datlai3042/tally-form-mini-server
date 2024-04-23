import { Router } from 'express'
import authentication from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

const routerAccount = Router()

routerAccount.use(authentication)
routerAccount.get('/me', AccountService.me)

export default routerAccount
