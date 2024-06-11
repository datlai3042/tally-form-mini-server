import { Router } from 'express'
import FormAnswerController from '~/controllers/formAnswer.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerFormAnswer = Router()
routerFormAnswer.post('/add-new-form-report', asyncHandler(FormAnswerController.addAnswerForm))

routerFormAnswer.use(authentication)
routerFormAnswer.get('/get-form-answer', asyncHandler(FormAnswerController.getFormAnswer))

export default routerFormAnswer
