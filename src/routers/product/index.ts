import { Router } from 'express'
import authentication from '~/middlewares/authentication'

const routerProduct = Router()

routerProduct.use(authentication)
routerProduct.get('/get-all-product', (req, res, next) => res.json('Đã lấy tất cả sản phẩm'))

export default routerProduct
