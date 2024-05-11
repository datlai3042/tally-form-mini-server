import { RequestHandler, Router } from 'express'
import AuthController from '~/controllers/auth.controller'
import FormController from '~/controllers/form.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerForm = Router()
routerForm.get('/find-form-guess', asyncHandler(FormController.findFormGuess))

routerForm.use(authentication)
routerForm.get('/get-forms', asyncHandler(FormController.getForms))
routerForm.get('/get-form-id', asyncHandler(FormController.getFormId))

routerForm.get('/find-form', asyncHandler(FormController.findFormUpdate))

routerForm.post('/create-form', asyncHandler(FormController.createForm))
routerForm.post('/update-form', asyncHandler(FormController.updateForm))

export default routerForm
