import { RequestHandler, Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
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
routerForm.post('/upload-avatar', upload.single('file'), asyncHandler(FormController.uploadAvatar))
routerForm.post('/upload-cover', upload.single('file'), asyncHandler(FormController.uploadCover))
routerForm.post('/delete-cover', asyncHandler(FormController.deleteCover))
routerForm.post('/delete-avatar', asyncHandler(FormController.deleteAvatar))

routerForm.post('/create-form', asyncHandler(FormController.createForm))

routerForm.post('/update-form', asyncHandler(FormController.updateForm))

export default routerForm
