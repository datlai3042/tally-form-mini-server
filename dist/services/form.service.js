"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
const input_constants_1 = require("../constants/input.constants");
const form_model_1 = __importStar(require("../model/form.model"));
const formAnswer_model_1 = __importStar(require("../model/formAnswer.model"));
const input_model_1 = require("../model/input.model");
const notification_model_1 = require("../model/notification.model");
const notification_1 = __importDefault(require("../utils/notification"));
const upload_cloudinary_1 = __importDefault(require("../utils/upload.cloudinary"));
class FormService {
    //GET Thông tin FORM
    static async createForm(req, res, next) {
        const { user } = req;
        const formQuery = { form_owner: user?._id };
        const form = await form_model_1.default.create(formQuery);
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'Tạo Form thất bại' });
        const notification = await (0, notification_1.default)({ user_id: user?._id, type: 'System', core: { message: 'Bạn đã tạo một Form' } });
        return { form_id: await form._id };
    }
    static async getForms(req, res, next) {
        const { user } = req;
        const forms = await form_model_1.default.find({ form_owner: new mongoose_1.Types.ObjectId(user?._id), form_state: { $ne: 'isDelete' } });
        return { forms };
    }
    static async getListFormDelete(req, res, next) {
        const { user } = req;
        const forms = await form_model_1.default.find({ form_owner: user?._id, form_state: 'isDelete' });
        return { forms };
    }
    static async getFormId(req, res, next) {
        const { form_id } = req.query;
        const { user } = req;
        const form = await form_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id });
        return { form: form ? form : null };
    }
    static async getInfoFormNotification(req, res, next) {
        const { form_id, notification_id } = req.query;
        const { user } = req;
        const form = await form_model_1.default
            .findOne({ _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id })
            .select('form_title form_avatar form_setting_default');
        return { form: form ? form : null };
    }
    static async getFormUpdate(req, res, next) {
        const { user } = req;
        const { form_id } = req.body;
        const formQuery = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form_id) };
        const form = await form_model_1.default.findOne(formQuery);
        if (!form)
            throw new response_error_1.BadRequestError({ metadata: 'Tạo Form thất bại' });
        return { form };
    }
    static async getFormGuess(req, res, next) {
        const { form_id } = req.query;
        const form_state = 'isPublic';
        const formQuery = { _id: new mongoose_1.Types.ObjectId(form_id), form_state };
        const form = await form_model_1.default.findOne(formQuery);
        return { form: form ? form : null };
    }
    //DELETE FORM
    static async deleteFormId(req, res, next) {
        const { form_id } = req.query;
        const { user } = req;
        const form = await form_model_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(form_id), form_owner: user?._id }, { $set: { form_state: 'isDelete' } }, { new: true, upsert: true });
        return { form: form ? form : null };
    }
    static async deleteFormForever(req, res, next) {
        const { user } = req;
        const { form_id } = req.query;
        const formQuery = { _id: form_id, form_owner: user?._id };
        const formTitleSubQuery = { form_id: form_id };
        const options = { new: true, upsert: true };
        const deleteForm = await form_model_1.default.findOneAndDelete(formQuery, options);
        const deleteFormTitleSub = await form_model_1.formTitleSubModel.findOneAndDelete(formTitleSubQuery, options);
        const deleteFormAnswerMini = await formAnswer_model_1.formAnswerMiniModel.findOneAndDelete(formTitleSubQuery, options);
        const deleteFormAnswer = await formAnswer_model_1.default.findOneAndDelete(formTitleSubQuery, options);
        const found_notification_user = { notification_user_id: user?._id };
        await notification_model_1.notificationModel.findOneAndDelete({ 'core.form_id': form_id.toString() });
        const createNotification = await (0, notification_1.default)({ user_id: user?._id, type: 'System', core: { message: 'Đã xóa vĩnh viễn một form' } });
        const notification_user = await notification_model_1.notificationUserModel.findOne(found_notification_user);
        notification_user.notifications = notification_user?.notifications.filter((notification) => {
            if (notification.type === 'Form_Answers' && notification.core.form_id == form_id.toString()) {
                return null;
            }
            return notification;
        });
        console.log({ notifications: notification_user?.notifications });
        notification_user?.save();
        return { message: 'Xóa thành công' };
    }
    //UPDATE FORM HIỂN THỊ
    static async changeModeForm(req, res, next) {
        const { user } = req;
        const { form_id, mode } = req.body;
        //update
        const formQuery = { _id: form_id, form_owner: user?._id };
        const formUpdate = { $set: { form_state: mode } };
        const formOptions = { new: true, upsert: true };
        const newForm = await form_model_1.default.findOneAndUpdate(formQuery, formUpdate, formOptions);
        return { form: newForm };
    }
    static async changeModeDisplay(req, res, next) {
        const { user } = req;
        const { form_id, mode } = req.body;
        //update
        const formQuery = { _id: form_id, form_owner: user?._id };
        const formUpdate = { $set: { form_mode_display: mode } };
        const formOptions = { new: true, upsert: true };
        const newForm = await form_model_1.default.findOneAndUpdate(formQuery, formUpdate, formOptions);
        return { form: newForm };
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
    //UPDATE TIÊU ĐỀ FORM
    static async setTitleForm(req, res, next) {
        const { form_id, value } = req.body;
        const { user } = req;
        const updateFormQuery = { form_owner: user?._id, _id: form_id };
        const updateFormUpdate = { $set: { 'form_title.form_title_value': value } };
        const updateFormOption = { new: true, upsert: true };
        const updateFormDoc = await form_model_1.default.findOneAndUpdate(updateFormQuery, updateFormUpdate, updateFormOption);
        return { form: updateFormDoc };
    }
    static async addSubTitleItem(req, res, next) {
        const { user } = req;
        const { form_id, type } = req.body;
        const formTitle = await form_model_1.formTitleSubModel.create({ type, form_id: form_id });
        //update
        const formQuery = { _id: form_id, form_owner: user?._id };
        const formUpdate = { $push: { 'form_title.form_title_sub': formTitle } };
        const formOptions = { new: true, upsert: true };
        const newForm = await form_model_1.default.findOneAndUpdate(formQuery, formUpdate, formOptions);
        return { form: newForm };
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
        const formQueryDoc = { _id: new mongoose_1.Types.ObjectId(form._id), form_owner: user?._id };
        const formUpdateDoc = { $set: { 'form_title.form_title_sub': titleSubItem } };
        const formOptions = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptions);
        return { form: formUpdate };
    }
    static async updateTitleSubText(req, res, next) {
        const { user } = req;
        const { form_id, form_title_sub_content, form_title_sub_id } = req.body;
        const formQueryDoc = { form_owner: user?._id, _id: new mongoose_1.Types.ObjectId(form_id), 'form_title.form_title_sub._id': form_title_sub_id };
        const formUpdateDoc = {
            $set: {
                'form_title.form_title_sub.$.value': form_title_sub_content,
                'form_title.form_title_sub.$.write': true
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        console.log({ formUpdateDoc: JSON.stringify(formUpdate) });
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
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
                form_inputs: form.form_inputs,
                form_mode_display: form.form_mode_display
            }
        };
        const formOptionDoc = { new: true, upsert: true };
        const formUpdate = await form_model_1.default.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc);
        if (!formUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'update form failure' });
        return { form: formUpdate };
    }
    // UPDATE IMAGE CỦA FORM
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
