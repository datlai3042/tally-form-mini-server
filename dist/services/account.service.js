"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_error_1 = require("../Core/response.error");
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const dataResponse_utils_1 = require("../utils/dataResponse.utils");
const inputsValidate_1 = require("../utils/inputsValidate");
const upload_cloudinary_1 = __importDefault(require("../utils/upload.cloudinary"));
class AccountService {
    static async me(req, res, next) {
        const { user } = req;
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'test', 'success', { httpOnly: true });
        return { user };
    }
    static async updateAvatar(req, res, next) {
        const user = req.user;
        const file = req.file;
        if (!file)
            throw new response_error_1.BadRequestError({ metadata: 'Missing File' });
        const folder = `tally-form-project/users/${user?.id}/avatar`;
        const result = await (0, upload_cloudinary_1.default)(req?.file, folder);
        const userQueryDoc = { _id: user?._id };
        const userUpdateDoc = {
            $set: { user_avatar_current: result.secure_url }
        };
        const userOptionDoc = { new: true, upsert: true };
        const userUpdate = await user_model_1.default.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc);
        if (!userUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'Unknown Error' });
        return { message: 'Success', user: (0, dataResponse_utils_1.omit)(userUpdate.toObject(), ['user_password']) };
    }
    static async updateEmail(req, res, next) {
        const { user } = req;
        const { user_new_email, user_password } = req.body;
        const checkEmail = (0, inputsValidate_1.validateEmail)(user_new_email);
        if (!checkEmail)
            throw new response_error_1.BadRequestError({ metadata: 'Email không hợp lệ' });
        const comparePassword = (0, bcrypt_utils_1.compare)(user_password, user?.user_password);
        if (!comparePassword)
            throw new response_error_1.BadRequestError({ metadata: 'Password not match !!!' });
        const user_atlas = user_new_email.split('@')[0];
        const userQueryDoc = { _id: user?._id };
        const userUpdateDoc = {
            $set: { user_email: user_new_email, user_atlas }
        };
        const userOptionDoc = { new: true, upsert: true };
        const userUpdate = await user_model_1.default.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc);
        if (!userUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'Unknown Error' });
        return { message: 'Success', user: (0, dataResponse_utils_1.omit)(userUpdate.toObject(), ['user_password']) };
    }
    static async updatePassword(req, res, next) {
        const { user } = req;
        const { user_password } = req.body;
        const comparePassword = (0, bcrypt_utils_1.compare)(user_password, user?.user_password);
        if (!comparePassword)
            throw new response_error_1.BadRequestError({ metadata: 'Password not match !!!' });
        const userQueryDoc = { _id: user?._id };
        const userUpdateDoc = {
            $set: { user_password }
        };
        const userOptionDoc = { new: true, upsert: true };
        const userUpdate = await user_model_1.default.findOneAndUpdate(userQueryDoc, userUpdateDoc, userOptionDoc);
        if (!userUpdate)
            throw new response_error_1.BadRequestError({ metadata: 'Unknown Error' });
        return { message: 'Success', user: (0, dataResponse_utils_1.omit)(userUpdate.toObject(), ['user_password']) };
    }
}
exports.default = AccountService;
