import { RequestHandler, Router } from 'express'
import AuthController from '~/controllers/auth.controller.js'
import { asyncHandler } from '~/helpers/asyncHandler.js'
import authentication from '~/middlewares/authentication.js'

const routerAuth = Router()

routerAuth.post('/register', asyncHandler(AuthController.register))
routerAuth.post('/login', asyncHandler(AuthController.login))

routerAuth.use(authentication)
routerAuth.post('/logout', asyncHandler(AuthController.logout))
routerAuth.get('/refresh-token', asyncHandler(AuthController.refresh_token))

export default routerAuth
