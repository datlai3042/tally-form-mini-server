import { CREATE, OK } from '../Core/response.success.js';
import FormService from '../services/form.service.js';
class FormController {
    static async createForm(req, res, next) {
        return new CREATE({ metadata: await FormService.createForm(req, res, next) }).send(res);
    }
    static async getForms(req, res, next) {
        return new CREATE({ metadata: await FormService.getForms(req, res, next) }).send(res);
    }
    static async getFormId(req, res, next) {
        return new CREATE({ metadata: await FormService.getFormId(req, res, next) }).send(res);
    }
    static async findFormUpdate(req, res, next) {
        return new OK({ metadata: await FormService.findFormUpdate(req, res, next) }).send(res);
    }
    static async findFormGuess(req, res, next) {
        return new OK({ metadata: await FormService.findFormGuess(req, res, next) }).send(res);
    }
    static async updateForm(req, res, next) {
        return new OK({ metadata: await FormService.updateForm(req, res, next) }).send(res);
    }
}
export default FormController;
