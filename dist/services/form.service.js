"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
const form_model_1 = __importDefault(require("../model/form.model"));
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
        console.log({ form_id });
        const form = await form_model_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(form_id) }, {}, { upsert: true, new: true });
        return { form };
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
    static async findFormGuess(req, res, next) {
        const { form_id } = req.body;
        const formQuery = { _id: new mongoose_1.Types.ObjectId(form_id) };
        const form = await form_model_1.default.findOne(formQuery);
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'create form failure' });
        return { form };
    }
    static async updateForm(req, res, next) {
        const { user } = req;
        const { form } = req.body;
        console.log({ body: req.body });
        // const form_state = form.form_state
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
        const formUpdateDoc = { $set: { form_avatar } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async deleteAvatar(req, res, next) {
        const { form_id } = req.body;
        const { user } = req;
        const foundForm = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id) });
        if (!foundForm || !foundForm.form_avatar) {
            throw new response_error_1.BadRequestError({ metadata: 'Không tìm thấy thông tin' });
        }
        const deleteAvatar = await cloudinary_config_1.default.uploader.destroy(foundForm.form_avatar.form_avatar_publicId);
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $unset: { form_avatar: 1 } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate?.form_avatar };
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
        const formUpdateDoc = { $set: { form_background: form_cover } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate?.form_background };
    }
    static async deleteCover(req, res, next) {
        const { form_id } = req.body;
        const { user } = req;
        const foundForm = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id) });
        if (!foundForm || !foundForm.form_background) {
            throw new response_error_1.BadRequestError({ metadata: 'Không tìm thấy thông tin' });
        }
        const deleteAvatar = await cloudinary_config_1.default.uploader.destroy(foundForm.form_background.form_backround_image_publicId);
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id };
        const formUpdateDoc = { $unset: { form_avatar: 1 } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
}
exports.default = FormService;
