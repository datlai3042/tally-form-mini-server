import { Router } from 'express'
import routerAuth from './auth/index.js'
import routerProduct from './product/index.js'
import routerForm from './form-core/index.js'
import routerAccount from './account/index.js'

const router = Router()

router.use('/v1/api/auth', routerAuth)
router.use('/v1/api/account', routerAccount)
router.use('/v1/api/product', routerProduct)
router.use('/v1/api/form', routerForm)

export default router
