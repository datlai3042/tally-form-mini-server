"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUpdateForm = exports.foundForm = void 0;
const response_error_1 = require("../Core/response.error");
const form_model_1 = __importDefault(require("../model/form.model"));
const foundForm = async ({ form_id, user_id }) => {
    const form = await form_model_1.default.findOne({ _id: form_id, form_owner: user_id });
    if (!form)
        throw new response_error_1.BadRequestError({ metadata: 'form_id không hợp lệ' });
    return form;
};
exports.foundForm = foundForm;
const generateUpdateForm = async ({ update, form_id, form_owner }) => {
    const formQuery = { _id: form_id, form_owner };
    const formOptions = { new: true, upsert: true };
    const newForm = await form_model_1.default.findOneAndUpdate(formQuery, update, formOptions);
    if (!newForm)
        throw new response_error_1.InternalError({ metadata: 'Không thể update form' });
    return newForm;
};
exports.generateUpdateForm = generateUpdateForm;
