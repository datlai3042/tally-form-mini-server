import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import FormService from '~/services/form.service'
import FormInputService from '~/services/formInput.service'
import FormInput from '~/services/formInput.service'
import { CustomRequest } from '~/type'

class FormController {
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.createForm(req, res, next) }).send(res)
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.getForms(req, res, next) }).send(res)
      }

      static async addInputAndSetTitle(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInputAndSetTitle(req, res, next) }).send(res)
      }

      static async addInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInput(req, res, next) }).send(res)
      }

      static async addInputToEnter(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInputToEnter(req, res, next) }).send(res)
      }

      static async getFormId(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.getFormId(req, res, next) }).send(res)
      }

      static async deleteFormId(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.deleteFormId(req, res, next) }).send(res)
      }

      static async findFormUpdate(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.findFormUpdate(req, res, next) }).send(res)
      }

      static async getFormGuess(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormGuess(req, res, next) }).send(res)
      }

      static async setModeImageForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.setModeImageForm(req, res, next) }).send(res)
      }

      static async updateForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateForm(req, res, next) }).send(res)
      }

      static async updateTitleInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.updateTitleInput(req, res, next) }).send(res)
      }

      static async updateTitleSub(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateTitleSub(req, res, next) }).send(res)
      }

      static async uploadTitleImage(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadTitleImage(req, res, next) }).send(res)
      }

      static async uploadAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadAvatar(req, res, next) }).send(res)
      }

      static async uploadCover(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadCover(req, res, next) }).send(res)
      }

      static async deleteAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteAvatar(req, res, next) }).send(res)
      }

      static async deleteCover(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteCover(req, res, next) }).send(res)
      }

      static async addInputToTitle(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addInputToTitle(req, res, next) }).send(res)
      }

      static async setTitleForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.setTitleForm(req, res, next) }).send(res)
      }

      static async updateInputItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateInputItem(req, res, next) }).send(res)
      }

      static async deleteInputItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteInputItem(req, res, next) }).send(res)
      }

      static async updateSettingInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.updateSettingInput(req, res, next) }).send(res)
      }

      static async addAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addAvatar(req, res, next) }).send(res)
      }

      static async addBackground(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addBackground(req, res, next) }).send(res)
      }

      static async changeInputType(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.changeInputType(req, res, next) }).send(res)
      }

      static async addOption(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.addOption(req, res, next) }).send(res)
      }

      static async updatePositionOption(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.updatePositionOption(req, res, next) }).send(res)
      }

      static async deleteOptionId(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.deleteOptionId(req, res, next) }).send(res)
      }
}

export default FormController
