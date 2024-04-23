import { Router } from 'express'
import routerAuth from './auth'
import routerProduct from './product'
import routerAccount from './account'

const router = Router()

router.use('/v1/api/auth', routerAuth)
router.use('/v1/api/account', routerAccount)
router.use('/v1/api/product', routerProduct)

export default router
