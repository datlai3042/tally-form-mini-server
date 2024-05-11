import { Router } from 'express'
import routerAuth from './auth'
import routerProduct from './product'
import routerAccount from './account'
import routerForm from './form'

const router = Router()

router.use('/v1/api/auth', routerAuth)
router.use('/v1/api/account', routerAccount)
router.use('/v1/api/product', routerProduct)
router.use('/v1/api/form', routerForm)

export default router
