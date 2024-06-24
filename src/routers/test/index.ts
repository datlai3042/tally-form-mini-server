import { RequestHandler, Router } from 'express'
import FormController from '~/controllers/form.controller.js'
import { asyncHandler } from '~/helpers/asyncHandler.js'
import authentication from '~/middlewares/authentication.js'

const routerForm = Router()
routerForm.get('/find-form-guess', asyncHandler(FormController.getFormGuess))

routerForm.use(authentication)
routerForm.get('/get-forms', asyncHandler(FormController.getForms))
routerForm.get('/get-form-id', asyncHandler(FormController.getFormId))

routerForm.get('/find-form', asyncHandler(FormController.getFormUpdate))

routerForm.post('/create-form', asyncHandler(FormController.createForm))
routerForm.post('/update-form', asyncHandler(FormController.updateForm))

export default routerForm
