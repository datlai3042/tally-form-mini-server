import { NextFunction, Request, Response, Router } from 'express'
import routerAuth from './auth'
import routerAccount from './account'
import routerProduct from './product'
import routerForm from './form-core'
import routerFormAnswer from './formAnswer'
import routerNotification from './notification'

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => res.json({ message: 'xin chào' }))
router.use('/v1/api/auth', routerAuth)
router.use('/v1/api/account', routerAccount)
router.use('/v1/api/product', routerProduct)
router.use('/v1/api/form', routerForm)
router.use('/v1/api/form-answer', routerFormAnswer)
router.use('/v1/api/notification', routerNotification)

export default router
