import { RequestHandler, Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
import FormController from '~/controllers/form.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerForm = Router()
routerForm.get('/get-form-guess', asyncHandler(FormController.getFormGuess))

routerForm.use(authentication)
routerForm.get('/get-forms', asyncHandler(FormController.getForms))
routerForm.get('/get-form-id', asyncHandler(FormController.getFormId))

routerForm.get('/find-form', asyncHandler(FormController.findFormUpdate))

routerForm.post('/create-form', asyncHandler(FormController.createForm))
routerForm.post('/upload-avatar', upload.single('file'), asyncHandler(FormController.uploadAvatar))
routerForm.post('/add-avatar', upload.single('file'), asyncHandler(FormController.addAvatar))
routerForm.post('/add-background', upload.single('file'), asyncHandler(FormController.addBackground))

routerForm.post('/upload-cover', upload.single('file'), asyncHandler(FormController.uploadCover))
routerForm.post('/delete-cover', asyncHandler(FormController.deleteCover))
routerForm.post('/delete-avatar', asyncHandler(FormController.deleteAvatar))

routerForm.post('/create-form', asyncHandler(FormController.createForm))

routerForm.post('/update-form', asyncHandler(FormController.updateForm))
routerForm.post('/add-input-to-title', asyncHandler(FormController.addInputToTitle))
routerForm.post('/add-input-to-title', asyncHandler(FormController.addInputToTitle))
routerForm.post('/set-title-form', asyncHandler(FormController.setTitleForm))
routerForm.post('/update-input-item', asyncHandler(FormController.updateInputItem))
routerForm.post('/delete-input-item', asyncHandler(FormController.deleteInputItem))
routerForm.post('/update-input-item-setting', asyncHandler(FormController.updateSettingInput))

export default routerForm
