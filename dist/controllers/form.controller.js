"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const form_service_1 = __importDefault(require("../services/form.service"));
const formInput_service_1 = __importDefault(require("../services/formInput.service"));
const input_option_service_1 = __importDefault(require("../services/input_type/input_option.service"));
class FormController {
    //GET
    static async createForm(req, res, next) {
        return new response_success_1.CREATE({ metadata: await form_service_1.default.createForm(req, res, next) }).send(res);
    }
    static async getFormId(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getFormId(req, res, next) }).send(res);
    }
    static async getForms(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getForms(req, res, next) }).send(res);
    }
    static async getInfoFormNotification(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getInfoFormNotification(req, res, next) }).send(res);
    }
    static async getFormUpdate(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getFormUpdate(req, res, next) }).send(res);
    }
    static async getFormGuess(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getFormGuess(req, res, next) }).send(res);
    }
    static async getListFormDelete(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.getListFormDelete(req, res, next) }).send(res);
    }
    static async changeModeDisplay(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.changeModeDisplay(req, res, next) }).send(res);
    }
    static async addInputAndSetTitle(req, res, next) {
        return new response_success_1.CREATE({ metadata: await formInput_service_1.default.addInputAndSetTitle(req, res, next) }).send(res);
    }
    static async addInput(req, res, next) {
        return new response_success_1.CREATE({ metadata: await formInput_service_1.default.addInput(req, res, next) }).send(res);
    }
    static async addInputToEnter(req, res, next) {
        return new response_success_1.CREATE({ metadata: await formInput_service_1.default.addInputToEnter(req, res, next) }).send(res);
    }
    //Thay đổi mode
    static async changeModeForm(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.changeModeForm(req, res, next) }).send(res);
    }
    static async setModeImageForm(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.setModeImageForm(req, res, next) }).send(res);
    }
    static async deleteFormId(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.deleteFormId(req, res, next) }).send(res);
    }
    static async deleteFormForever(req, res, next) {
        return new response_success_1.CREATE({ metadata: await form_service_1.default.deleteFormForever(req, res, next) }).send(res);
    }
    static async updateForm(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.updateForm(req, res, next) }).send(res);
    }
    //update title của form
    static async updateTitleInput(req, res, next) {
        return new response_success_1.OK({ metadata: await formInput_service_1.default.updateTitleInput(req, res, next) }).send(res);
    }
    static async addSubTitleItem(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.addSubTitleItem(req, res, next) }).send(res);
    }
    static async updateTitleSubText(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.updateTitleSubText(req, res, next) }).send(res);
    }
    static async addInputToTitle(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.addInputToTitle(req, res, next) }).send(res);
    }
    static async setTitleForm(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.setTitleForm(req, res, next) }).send(res);
    }
    //form image
    static async uploadTitleImage(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.uploadTitleImage(req, res, next) }).send(res);
    }
    static async addAvatar(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.addAvatar(req, res, next) }).send(res);
    }
    static async addBackground(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.addBackground(req, res, next) }).send(res);
    }
    static async uploadAvatar(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.uploadAvatar(req, res, next) }).send(res);
    }
    static async uploadCover(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.uploadCover(req, res, next) }).send(res);
    }
    static async deleteAvatar(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.deleteAvatar(req, res, next) }).send(res);
    }
    static async deleteCover(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.deleteCover(req, res, next) }).send(res);
    }
    //Liên quan đến các input
    static async updateInputItem(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.updateInputItem(req, res, next) }).send(res);
    }
    static async deleteInputItem(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.deleteInputItem(req, res, next) }).send(res);
    }
    static async updateSettingInput(req, res, next) {
        return new response_success_1.OK({ metadata: await formInput_service_1.default.updateSettingInput(req, res, next) }).send(res);
    }
    static async changeInputType(req, res, next) {
        return new response_success_1.OK({ metadata: await formInput_service_1.default.changeInputType(req, res, next) }).send(res);
    }
    //INPUT - OPTION
    static async addOption(req, res, next) {
        return new response_success_1.OK({ metadata: await input_option_service_1.default.addOption(req, res, next) }).send(res);
    }
    static async updatePositionOption(req, res, next) {
        return new response_success_1.OK({ metadata: await input_option_service_1.default.updatePositionOption(req, res, next) }).send(res);
    }
    static async deleteOptionId(req, res, next) {
        return new response_success_1.OK({ metadata: await input_option_service_1.default.deleteOptionId(req, res, next) }).send(res);
    }
}
exports.default = FormController;
