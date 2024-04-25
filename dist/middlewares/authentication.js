"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER = void 0;
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const asyncHandler_1 = require("../helpers/asyncHandler");
const keyManager_model_1 = __importDefault(require("../model/keyManager.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const token_utils_1 = require("../utils/token.utils");
exports.HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
};
const authentication = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const client_id = req.cookies['client_id'];
    if (!client_id)
        throw new response_error_1.BadRequestError({ metadata: 'CLIENT::Không truyền user_id' });
    const access_token = req.cookies['access_token'];
    if (!access_token)
        throw new response_error_1.NotFoundError({ metadata: 'Không tìm thấy access_token' });
    const user = await user_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(client_id) });
    if (!user)
        throw new response_error_1.NotFoundError({ metadata: 'Không tìm thấy user' });
    const keyStore = await keyManager_model_1.default.findOne({ user_id: user._id });
    if (!keyStore)
        throw new response_error_1.NotFoundError({ metadata: 'Không tìm thấy key của user' });
    const force = req.body.force;
    if (force && req.originalUrl === '/v1/api/auth/logout') {
        req.user = user;
        return next();
    }
    //CASE: Auth refresh_token
    if (req.originalUrl === '/v1/api/auth/refresh-token') {
        const code_verify_token = req.headers['code_verify_token'];
        if (code_verify_token.toLowerCase() !== keyStore.code_verify_token.toLowerCase()) {
            throw new response_error_1.NotFoundError({ metadata: 'Yêu cầu không hợp lệ' });
        }
        const refresh_token = req.cookies['refresh_token'];
        if (!refresh_token)
            return next(new response_error_1.AuthFailedError({ metadata: 'Không tìm thấy refresh_token' }));
        return (0, token_utils_1.verifyRefreshToken)({ client_id, user, keyStore, token: refresh_token, key: keyStore.private_key, req, res, next });
    }
    //CASE: Auth access_token
    if (access_token) {
        return (0, token_utils_1.verifyAccessToken)({ client_id, user, keyStore, token: access_token, key: keyStore.public_key, req, res, next });
    }
});
exports.default = authentication;
