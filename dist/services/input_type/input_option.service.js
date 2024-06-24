"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_model_1 = __importDefault(require("../../model/form.model"));
const input_model_1 = require("../../model/input.model");
const uuid_1 = require("uuid");
class InputOptionService {
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
exports.default = InputOptionService;
