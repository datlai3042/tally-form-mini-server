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
const notification_1 = __importDefault(require("../utils/notification"));
const oAuth_1 = require("../utils/oAuth");
const token_utils_1 = require("../utils/token.utils");
class AuthService {
    static async register(req, res, next) {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name)
            throw new response_error_1.AuthFailedError({ metadata: 'Request thiếu các field bắt buốc' });
        const foundEmail = await user_model_1.default.findOne({ user_email: email });
        if (foundEmail)
            throw new response_error_1.AuthFailedError({ metadata: 'Email đã tồn tại' });
        const hashPassword = await (0, bcrypt_utils_1.hassPassword)(password);
        const user_atlas = email.split('@')[0];
        const createUser = await user_model_1.default.create({
            user_email: email,
            user_password: hashPassword,
            user_first_name: first_name,
            user_last_name: last_name,
            user_auth: 'email',
            user_password_state: true,
            user_atlas
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
        const createNotification = await (0, notification_1.default)({ user_id: createUser?._id, type: 'System', core: { message: 'Cảm ơn bạn đã tạo tài khoản' } });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', createUser._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', token.access_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', token.refresh_token, { httpOnly: true });
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
            throw new response_error_1.AuthFailedError({ metadata: 'Không tìm thấy thông tin tài khoản' });
        const checkPassword = (0, bcrypt_utils_1.compare)(password, foundUser?.user_password);
        if (!checkPassword)
            throw new response_error_1.AuthFailedError({ metadata: 'Không tin tài khoản không chính xác' });
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
        const createNotification = await (0, notification_1.default)({ user_id: foundUser?._id, type: 'System', core: { message: 'Chào mừng bạn quay trở lại' } });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', foundUser._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', refresh_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
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
        const createNotification = await (0, notification_1.default)({ user_id: user?._id, type: 'System', core: { message: 'Đăng xuất thành công' } });
        res.clearCookie('client_id');
        res.clearCookie('refresh_token');
        res.clearCookie('code_verify_token');
        res.clearCookie('access_token');
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
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', new_refresh_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', user._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
        return {
            user: (0, dataResponse_utils_1.omit)(user.toObject(), ['user_password']),
            token: { access_token, refresh_token: new_refresh_token, code_verify_token },
            expireToken,
            client_id: user._id.toString()
        };
    }
    static async oAuthWithGoogle(req, res, next) {
        const { code } = req.query;
        const data = await (0, oAuth_1.getOAuthGoogleToken)({ code });
        const { id_token, access_token: access_token_google } = data;
        const google_user = await (0, oAuth_1.getGoogleUser)({ id_token, access_token: access_token_google });
        if (!google_user.verified_email) {
            throw new response_error_1.BadRequestError({ metadata: 'Email Không hợp lệ' });
        }
        console.log({ email: google_user.email });
        const { public_key, private_key } = (0, token_utils_1.generatePaidKey)();
        if (!public_key || !private_key)
            throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo key sercet' });
        const found_user_system = await user_model_1.default.findOne({ user_email: google_user.email });
        if (found_user_system) {
            await keyManager_model_1.default.findOneAndDelete({ user_id: found_user_system._id });
            const payload = (0, token_utils_1.createPayload)(found_user_system);
            const { access_token, refresh_token } = (0, token_utils_1.generatePaidToken)(payload, { public_key, private_key });
            const code_verify_token = (0, token_utils_1.generateCodeVerifyToken)();
            const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = (0, token_utils_1.fillDataKeyModel)(found_user_system, public_key, private_key, refresh_token, code_verify_token);
            const keyStore = await keyManager_model_1.default.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption);
            if (!keyStore)
                throw new response_error_1.ResponseError({ metadata: 'Server không thể tạo model key' });
            (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', found_user_system._id.toString(), { httpOnly: true });
            (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
            const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', refresh_token, { httpOnly: true });
            (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
            const url_client = process.env.MODE === 'DEV' ? 'http://localhost:3000/oauth-google' : process.env.CLIENT_URL + '/oauth-google';
            const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${found_user_system._id}`;
            res.redirect(url_full);
        }
        const { email, family_name, given_name, picture } = google_user;
        const hashPassword = await (0, bcrypt_utils_1.hassPassword)(process.env.KEY_PASSWORD);
        const user_atlas = email.split('@')[0];
        const user_data = {
            user_email: email,
            user_first_name: given_name,
            user_last_name: family_name,
            user_avatar_current: picture,
            user_auth: 'oAuth',
            user_password: hashPassword,
            user_roles: 'USER',
            user_gender: 'MALE',
            user_atlas
        };
        const create_user = await user_model_1.default.create(user_data);
        const payload = (0, token_utils_1.createPayload)(create_user);
        const { access_token, refresh_token } = (0, token_utils_1.generatePaidToken)(payload, { public_key, private_key });
        const code_verify_token = (0, token_utils_1.generateCodeVerifyToken)();
        const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = (0, token_utils_1.fillDataKeyModel)(create_user, public_key, private_key, refresh_token, code_verify_token);
        const keyStore = await keyManager_model_1.default.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption);
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'client_id', create_user._id.toString(), { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'code_verify_token', code_verify_token, { httpOnly: true });
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.oneWeek, 'refresh_token', refresh_token, { httpOnly: true });
        (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'access_token', access_token, { httpOnly: true });
        const url_client = process.env.MODE === 'DEV' ? 'http://localhost:3000/oauth-google' : process.env.CLIENT_URL + '/oauth-google';
        const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${create_user._id}`;
        res.redirect(url_full);
    }
}
exports.default = AuthService;
