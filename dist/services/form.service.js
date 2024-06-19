"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
const input_constants_1 = require("../constants/input.constants");
const form_model_1 = __importDefault(require("../model/form.model"));
const input_model_1 = require("../model/input.model");
const upload_cloudinary_1 = __importDefault(require("../utils/upload.cloudinary"));
class FormService {
    static async createForm(req, res, next) {
        const { user } = req;
        const formQuery = { form_owner: user?._id };
        const form = await form_model_1.default.create(formQuery);
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'create form failure' });
        return { form_id: await form._id };
    }
    static async getForms(req, res, next) {
        const { user } = req;
        const forms = await form_model_1.default.find({ form_owner: new mongoose_1.Types.ObjectId(user?._id) });
        return { forms };
    }
    static async getFormId(req, res, next) {
        const { form_id } = req.query;
        const { user } = req;
        const form = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id });
        return { form: form ? form : null };
    }
    static async deleteFormId(req, res, next) {
        const { form_id } = req.query;
        console.log({ form_id });
        const form = await form_model_1.default.findOneAndDelete({ _id: new mongoose_1.Types.ObjectId(form_id) });
        return { form: form ? form : null };
    }
    static async findFormUpdate(req, res, next) {
        const { user } = req;
        const { form_id } = req.body;
        const formQuery = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form_id) };
        const form = await form_model_1.default.findOne(formQuery);
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'create form failure' });
        return { form };
    }
    static async getFormGuess(req, res, next) {
        const { form_id } = req.query;
        const formQuery = { _id: new mongoose_1.Types.ObjectId(form_id) };
        const form = await form_model_1.default.findOne(formQuery);
        return { form: form ? form : null };
    }
    static async updateTitleSub(req, res, next) {
        const { user } = req;
        const { form_title_sub, form_id } = req.body;
        const formQueryDoc = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form_id) };
        const formUpdateDoc = {
            $set: {
                'form_title.form_title_sub': form_title_sub
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        console.log({ formUpdateDoc: JSON.stringify(formUpdate) });
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        return { form: formUpdate };
    }
    static async updateForm(req, res, next) {
        const { user } = req;
        const { form, inputItem } = req.body;
        const formQueryDoc = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form._id) };
        const formUpdateDoc = {
            $set: {
                form_title: form.form_title,
                form_setting_default: form.form_setting_default,
                form_background: form.form_background,
                form_avatar: form.form_avatar,
                form_state: form.form_state,
                form_inputs: form.form_inputs
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        console.log({ formUpdateDoc: JSON.stringify(formUpdate) });
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        return { form: formUpdate };
    }
    static async addAvatar(req, res, next) {
        const { form } = req.body;
        const { user } = req;
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form._id), form_owner: user?._id };
        const formUpdateDoc = { $set: { form_avatar_state: true, form_avatar: { mode: 'circle', position: 'left' } } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async addBackground(req, res, next) {
        const { form } = req.body;
        const { user } = req;
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form._id), form_owner: user?._id };
        const formUpdateDoc = { $set: { form_background_state: true } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async uploadTitleImage(req, res, next) {
        const file = req.file;
        const { form_id, titleSubId } = req.body;
        const { user } = req;
        if (!file)
            throw new response_error_1.BadRequestError({ metadata: 'Missing File' });
        const form = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id) });
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'form_id không hợp lệ' });
        const folder = `tally-form-project/users/${user?.id}/${form._id}/title/images`;
        const result = await (0, upload_cloudinary_1.default)(req?.file, folder);
        const titleSubItem = form.form_title?.form_title_sub.map((ft) => {
            console.log(ft._id, titleSubId);
            if (new mongoose_1.Types.ObjectId(ft._id).toString() === titleSubId) {
                console.log(ft._id === titleSubId, titleSubId);
                ft.value = result.secure_url;
                ft.write = true;
                return ft;
            }
            return ft;
        });
        console.log({ titleSubItem });
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form._id), form_owner: user?._id };
        const formUpdateDoc = { $set: { 'form_title.form_title_sub': titleSubItem } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async uploadAvatar(req, res, next) {
        const file = req.file;
        const { form_id } = req.body;
        const { user } = req;
        if (!file)
            throw new response_error_1.BadRequestError({ metadata: 'Missing File' });
        const folder = `tally-form-project/users/${user?.id}/form_id/avatar`;
        const result = await (0, upload_cloudinary_1.default)(req?.file, folder);
        const form_avatar = { form_avatar_url: result.secure_url, form_avatar_publicId: result.public_id };
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $set: { form_avatar, form_avatar_state: true } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async deleteAvatar(req, res, next) {
        const { form_id, mode } = req.body;
        const { user } = req;
        const foundForm = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id) });
        if (mode === 'Image') {
            if (foundForm && foundForm.form_avatar) {
                const deleteAvatar = await cloudinary_config_1.default.uploader.destroy(foundForm.form_avatar.form_avatar_publicId);
            }
            const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
            const formUpdateDoc = { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } };
            const formOptions = { new: true, upsert: true };
            const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
            return { form: formUpdate };
        }
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async uploadCover(req, res, next) {
        const file = req.file;
        const { form_id } = req.body;
        const { user } = req;
        if (!file)
            throw new response_error_1.BadRequestError({ metadata: 'Missing File' });
        const folder = `tally-form-project/users/${user?.id}/form_id/cover`;
        const result = await (0, upload_cloudinary_1.default)(req?.file, folder);
        const form_cover = { form_background_iamge_url: result.secure_url, form_backround_image_publicId: result.public_id };
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $set: { form_background: form_cover, form_background_state: true } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async deleteCover(req, res, next) {
        const { form_id } = req.body;
        const { user } = req;
        const foundForm = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id) });
        if (foundForm && foundForm.form_background) {
            const deleteAvatar = await cloudinary_config_1.default.uploader.destroy(foundForm.form_background.form_backround_image_publicId);
        }
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $unset: { form_background: 1 }, $set: { form_background_state: false } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async addInputToTitle(req, res, next) {
        // const { form } = req.body
        // const { user } = req
        // const updateFormQuery = { form_owner: user?._id, _id: form._id }
        // const updateFormUpdate = { $set: { form_title: form.form_title, form_inputs: form.form_inputs } }
        // const updateFormOption = { new: true, upsert: true }
        // const updateFormDoc = await formModel.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption)
        // return { form: updateFormDoc }
        const { user } = req;
        const { form } = req.body;
        const newInput = await input_model_1.inputModel.create({ core: { setting: input_constants_1.inputSettingText }, type: 'TEXT' });
        const newForm = await form_model_1.default.findOneAndUpdate({ _id: form._id, form_owner: user?._id }, { $push: { form_inputs: newInput } }, { new: true, upsert: true });
        return { form: newForm };
    }
    static async setTitleForm(req, res, next) {
        const { form } = req.body;
        const { user } = req;
        const updateFormQuery = { form_owner: user?._id, _id: form._id };
        const updateFormUpdate = { $set: { form_title: form.form_title } };
        const updateFormOption = { new: true, upsert: true };
        const updateFormDoc = await form_model_1.default.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption);
        return { form: updateFormDoc };
    }
    static async setModeImageForm(req, res, next) {
        const { form_id, mode } = req.body;
        const { user } = req;
        const updateFormQuery = { form_owner: user?._id, _id: form_id };
        const updateFormUpdate = { $set: { 'form_title.form_title_mode_image': mode } };
        const updateFormOption = { new: true, upsert: true };
        const updateFormDoc = await form_model_1.default.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption);
        return { form: updateFormDoc };
    }
    static async updateInputItem(req, res, next) {
        const { form, newInput } = req.body;
        const { _id } = newInput;
        const formQuery = { _id: form._id, 'form_inputs._id': new mongoose_1.Types.ObjectId(_id) };
        const formUpdate = { 'form_inputs.$': newInput };
        const formOption = { new: true, upsert: true };
        const formUpdateDoc = await form_model_1.default.findOneAndUpdate(formQuery, formUpdate, formOption);
        return { form: formUpdateDoc };
    }
    static async deleteInputItem(req, res, next) {
        const { user } = req;
        const { form } = req.body;
        const formQueryDoc = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form._id) };
        const formUpdateDoc = {
            $set: {
                form_title: form.form_title,
                form_setting_default: form.form_setting_default,
                form_background: form.form_background,
                form_state: form.form_state,
                form_inputs: form.form_inputs
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        return { form: formUpdate };
    }
}
exports.default = FormService;
