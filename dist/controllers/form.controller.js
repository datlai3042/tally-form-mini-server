"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const form_service_1 = __importDefault(require("../services/form.service"));
class FormController {
    static async createForm(req, res, next) {
        return new response_success_1.CREATE({ metadata: await form_service_1.default.createForm(req, res, next) }).send(res);
    }
    static async getForms(req, res, next) {
        return new response_success_1.CREATE({ metadata: await form_service_1.default.getForms(req, res, next) }).send(res);
    }
    static async getFormId(req, res, next) {
        return new response_success_1.CREATE({ metadata: await form_service_1.default.getFormId(req, res, next) }).send(res);
    }
    static async findFormUpdate(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.findFormUpdate(req, res, next) }).send(res);
    }
    static async findFormGuess(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.findFormGuess(req, res, next) }).send(res);
    }
    static async updateForm(req, res, next) {
        return new response_success_1.OK({ metadata: await form_service_1.default.updateForm(req, res, next) }).send(res);
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
}
exports.default = FormController;
