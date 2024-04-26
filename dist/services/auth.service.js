"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_error_1 = require("../Core/response.error");
const keyManager_model_1 = __importDefault(require("../model/keyManager.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const dataResponse_utils_1 = require("../utils/dataResponse.utils");
const token_utils_1 = require("../utils/token.utils");
class AuthService {
    static async register(req, res, next) {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name)
            throw new response_error_1.BadRequestError({ metadata: 'Missing Field' });
        const foundEmail = await user_model_1.default.findOne({ user_email: email });
        if (foundEmail)
            throw new response_error_1.BadRequestError({ metadata: 'Email đã tồn tại' });
        const hashPassword = await (0, bcrypt_utils_1.hassPassword)(password);
        const createUser = await user_model_1.default.create({
            user_email: email,
            user_password: hashPassword,
            user_first_name: first_name,
            user_last_name: last_name
        });
        if (!createUser)
            throw new response_error_1.ResponseError({ metadata: 'Không thể đăng kí user do lỗi' });
        const { private_key, public_key } = (0, token_utils_1.generatePaidKey)();
        if (!public_key || !private_key)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo key sercet' });
        const payload = (0, token_utils_1.createPayload)(createUser);
        const token = (0, token_utils_1.generatePaidToken)(payload, { public_key, private_key });
        const code_verify_token = (0, token_utils_1.generateCodeVerifyToken)();
        const { modelKeyQuery, modelKeyUpdate, modelKeyOption } = (0, token_utils_1.fillDataKeyModel)(createUser, public_key, private_key, token.refresh_token, code_verify_token);
        const createKey = await keyManager_model_1.default.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption);
        if (!createKey)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo model key' });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', createUser._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', token.access_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', token.refresh_token, { httpOnly: true });
        return {
            user: (0, dataResponse_utils_1.omit)(createUser.toObject(), ['user_password']),
            token: { access_token: token.access_token, refresh_token: token.refresh_token, code_verify_token },
            expireToken,
            client_id: createUser._id
        };
    }
    static async login(req, res, next) {
        const { email, password } = req.body;
        const foundUser = await user_model_1.default.findOne({ user_email: email });
        if (!foundUser)
            throw new response_error_1.NotFoundError({ metadata: 'Không tìm thấy user' });
        const checkPassword = (0, bcrypt_utils_1.compare)(password, foundUser?.user_password);
        if (!checkPassword)
            throw new response_error_1.AuthFailedError({ metadata: 'Something wrongs...' });
        const foundKey = await keyManager_model_1.default.findOneAndDelete({ user_id: foundUser._id });
        const { public_key, private_key } = (0, token_utils_1.generatePaidKey)();
        if (!public_key || !private_key)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo key sercet' });
        const payload = (0, token_utils_1.createPayload)(foundUser);
        const { access_token, refresh_token } = (0, token_utils_1.generatePaidToken)(payload, { public_key, private_key });
        const code_verify_token = (0, token_utils_1.generateCodeVerifyToken)();
        const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = (0, token_utils_1.fillDataKeyModel)(foundUser, public_key, private_key, refresh_token, code_verify_token);
        const keyStore = await keyManager_model_1.default.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption);
        if (!keyStore)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo model key' });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', foundUser._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', refresh_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
        return {
            user: (0, dataResponse_utils_1.omit)(foundUser.toObject(), ['user_password']),
            token: { access_token, refresh_token, code_verify_token },
            expireToken,
            client_id: foundUser._id
        };
    }
    static async logout(req, res, next) {
        const user = req.user;
        const { force } = req.body;
        if (force) {
            await keyManager_model_1.default.findOneAndDelete({ user_id: user._id });
            return { message: 'Token hết hạn và đẵ buộc phải logout', force };
        }
        await keyManager_model_1.default.findOneAndDelete({ user_id: user._id });
        return { message: 'Logout thành công' };
    }
    static async refresh_token(req, res, next) {
        const { refresh_token } = req;
        const user = req.user;
        const { public_key, private_key } = (0, token_utils_1.generatePaidKey)();
        if (!public_key || !private_key)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo key sercet' });
        const payload = (0, token_utils_1.createPayload)(user);
        const { access_token, refresh_token: new_refresh_token } = (0, token_utils_1.generatePaidToken)(payload, { public_key, private_key });
        const code_verify_token = (0, token_utils_1.generateCodeVerifyToken)();
        const keyModelQuery = { user_id: user._id };
        const keyModelUpdate = {
            $set: { refresh_token: new_refresh_token, private_key, public_key, code_verify_token },
            $addToSet: { refresh_token_used: refresh_token }
        };
        const keyModelOption = { new: true, upsert: true };
        const updateKeyModel = await keyManager_model_1.default.findOneAndUpdate(keyModelQuery, keyModelUpdate, keyModelOption);
        console.log({ key: updateKeyModel?.toObject() });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', new_refresh_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', user._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
        return {
            user: (0, dataResponse_utils_1.omit)(user.toObject(), ['user_password']),
            token: { access_token, refresh_token: new_refresh_token, code_verify_token },
            expireToken,
            client_id: user._id.toString()
        };
    }
}
exports.default = AuthService;
