"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const formAnswer_service_1 = __importDefault(require("../services/formAnswer.service"));
class FormAnswerController {
    static async addAnswerForm(req, res, next) {
        return new response_success_1.CREATE({ metadata: await formAnswer_service_1.default.addAnswerForm(req, res, next) }).send(res);
    }
    static async getFormAnswer(req, res, next) {
        return new response_success_1.CREATE({ metadata: await formAnswer_service_1.default.getFormAnswer(req, res, next) }).send(res);
    }
}
exports.default = FormAnswerController;
