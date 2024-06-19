"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const input_constants_1 = require("../constants/input.constants");
const form_model_1 = __importDefault(require("../model/form.model"));
const input_model_1 = require("../model/input.model");
const input_utils_1 = require("../utils/input.utils");
const uuid_1 = require("uuid");
class FormInputService {
    static async addInputAndSetTitle(req, res, next) {
        const { user } = req;
        const { form, title } = req.body;
        const newInput = await input_model_1.inputModel.create({ core: { setting: input_constants_1.inputSettingText }, type: 'TEXT' });
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
    static async addInput(req, res, next) {
        const { user } = req;
        const { form } = req.body;
        const newInput = await input_model_1.inputModel.create({ core: { setting: input_constants_1.inputSettingText } });
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form._id, form_owner: user?._id }, { $push: { form_inputs: newInput } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async updateSettingInput(req, res, next) {
        const { user } = req;
        const { form, input_id, input_id_setting } = req.body;
        const inputItem = await input_model_1.inputModel.findOne({ _id: new mongoose_1.Types.ObjectId(input_id) });
        inputItem.core.setting = input_id_setting;
        const formQueryDoc = { form_owner: user?._id, _id: form._id, 'form_inputs._id': inputItem?._id };
        console.log({ inputItem });
        const formUpdateDoc = {
            $set: {
                'form_inputs.$.core': inputItem.core
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        console.log({ form: JSON.stringify(formUpdate) });
        return { form: formUpdate };
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
        const updateInput = await input_model_1.inputModel.findOneAndUpdate({ _id: inputItem._id }, { $set: { core: core } }, { new: true, upsert: true });
        const foundForm = { _id: form._id, form_owner: user?._id, 'form_inputs._id': updateInput?._id };
        const updateForm = { 'form_inputs.$.core': updateInput?.toObject().core, 'form_inputs.$.type': type };
        const options = { new: true, upsert: true };
        const newForm = await form_model_1.default.findOneAndUpdate(foundForm, updateForm, options);
        return { form: newForm };
    }
    static async updatePositionOption(req, res, next) {
        const { user } = req;
        const { form, inputItem, coreOption } = req.body;
        const updateInput = await input_model_1.inputModel.findOneAndUpdate({ _id: inputItem._id }, { $set: { core: { options: coreOption, setting: inputItem.core.setting } } }, { new: true, upsert: true });
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form._id, form_owner: user?._id, 'form_inputs._id': inputItem._id }, { $set: { 'form_inputs.$.core': updateInput?.toObject().core } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async addOption(req, res, next) {
        const { user } = req;
        const { form, option_id, option_value, inputItem } = req.body;
        const findOption = inputItem.core.options.findIndex((op) => op.option_id === option_id);
        if (findOption === -1) {
            inputItem.core.options.push({ option_id: (0, uuid_1.v4)(), option_value: option_value });
        }
        else {
            inputItem.core.options[findOption] = { option_id, option_value };
        }
        console.log({ inputCore: JSON.stringify(inputItem.core.options), findOption });
        const updateInput = await input_model_1.inputModel.findOneAndUpdate({ _id: inputItem._id }, { $set: { core: { options: inputItem.core.options, setting: inputItem.core.setting } } }, { new: true, upsert: true });
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form._id, form_owner: user?._id, 'form_inputs._id': inputItem._id }, { $set: { 'form_inputs.$.core': updateInput?.toObject().core } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async deleteOptionId(req, res, next) {
        const { user } = req;
        const { form_id, inputItem_id, option_id } = req.query;
        //cập nhập input
        const queryInput = { _id: inputItem_id, 'core.options.option_id': option_id };
        const updateInput = { $pull: { 'core.options': { option_id: option_id } } };
        const options = { new: true, upsert: true };
        const superInput = await input_model_1.inputModel.findOneAndUpdate(queryInput, updateInput, options);
        //cập nhập form tổng
        const queryForm = { _id: form_id, form_owner: user?._id, 'form_inputs._id': inputItem_id };
        const updateForm = { $set: { 'form_inputs.$.core': superInput?.toObject().core } };
        const superForm = await form_model_1.default.findOneAndUpdate(queryForm, updateForm, options);
        return { form: superForm };
    }
}
exports.default = FormInputService;
