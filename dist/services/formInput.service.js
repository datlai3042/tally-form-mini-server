"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_error_1 = require("../Core/response.error");
const input_constants_1 = require("../constants/input.constants");
const form_model_1 = __importDefault(require("../model/form.model"));
const input_model_1 = require("../model/input.model");
const input_utils_1 = require("../utils/input.utils");
class FormInputService {
    static async addInputAndSetTitle(req, res, next) {
        const { user } = req;
        const { form, title } = req.body;
        const newInput = { core: { setting: input_constants_1.inputSettingText }, type: 'TEXT' };
        const formTitle = { ...form.form_title, form_title_value: title };
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form._id, form_owner: user?._id }, { $push: { form_inputs: newInput }, $set: { form_title: formTitle } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async updateTitleInput(req, res, next) {
        const { user } = req;
        const { form, input_id, input_title_value } = req.body;
        const foundFormQuery = {
            _id: form._id,
            form_owner: user?._id,
            'form_inputs._id': input_id
        };
        const updateForm = {
            'form_inputs.$.input_title': input_title_value
        };
        const options = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(foundFormQuery, updateForm, options);
        return { form: formUpdate };
    }
    static async updateSettingInput(req, res, next) {
        const { user } = req;
        const { form, input_id, input_id_setting } = req.body;
        const formQueryDoc = { form_owner: user?._id, _id: form._id, 'form_inputs._id': input_id };
        const formUpdateDoc = {
            $set: {
                'form_inputs.$.core.setting': input_id_setting
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        console.log({ form: JSON.stringify(formUpdate) });
        return { form: formUpdate };
    }
    static async addInput(req, res, next) {
        const { user } = req;
        const { form_id } = req.body;
        const newInput = await input_model_1.inputModel.create({ core: { setting: input_constants_1.inputSettingText }, type: 'TEXT' });
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form_id, form_owner: user?._id }, { $push: { form_inputs: newInput } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async addInputToEnter(req, res, next) {
        const { user } = req;
        const { form, input_id_target, setting } = req.body;
        const indexInputCurrentEvent = form.form_inputs.findIndex((ip) => ip._id === input_id_target);
        const newInput = await input_model_1.inputModel.create({ core: { setting }, type: 'TEXT' });
        form.form_inputs.splice(indexInputCurrentEvent + 1, 0, newInput.toObject());
        const foundForm = { form_owner: user?._id, _id: form._id };
        const updateForm = { $set: { form_inputs: form.form_inputs } };
        const options = { new: true, upsert: true };
        const newFormUpdate = await form_model_1.default.findOneAndUpdate(foundForm, updateForm, options);
        return { form: newFormUpdate };
    }
    static async changeInputType(req, res, next) {
        const { user } = req;
        const { form, inputItem, type } = req.body;
        const core = (0, input_utils_1.generateInputSettingWithType)(type, form, inputItem);
        const tempObject = {
            type,
            core
        };
        console.log({ core });
        const foundForm = { _id: form._id, form_owner: user?._id, form_inputs: { $elemMatch: { _id: inputItem._id } } };
        const updateForm = {
            $set: {
                'form_inputs.$.core': core,
                'form_inputs.$.type': type
            }
        };
        const options = { new: true, upsert: true };
        const newForm = await form_model_1.default.findOneAndUpdate(foundForm, updateForm, options);
        return { form: newForm };
    }
}
exports.default = FormInputService;
