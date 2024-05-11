"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillDataKeyModel = exports.verifyRefreshToken = exports.verifyAccessToken = exports.createPayload = exports.generateCodeVerifyToken = exports.generatePaidKey = exports.generatePaidToken = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_error_1 = require("../Core/response.error");
const generatePaidToken = (payload, key) => {
    const access_token = jsonwebtoken_1.default.sign(payload, key.public_key, { expiresIn: '30m' });
    const refresh_token = jsonwebtoken_1.default.sign(payload, key.private_key, { expiresIn: '30m' });
    if (!access_token || !refresh_token)
        throw new response_error_1.ResponseError({ metadata: 'Lỗi do tạo key' });
    return { access_token, refresh_token };
};
exports.generatePaidToken = generatePaidToken;
const generatePaidKey = () => {
    const public_key = (0, crypto_1.randomBytes)(64).toString('hex');
    const private_key = (0, crypto_1.randomBytes)(64).toString('hex');
    return { public_key, private_key };
};
exports.generatePaidKey = generatePaidKey;
/**
 *
 * @returns Tạo mã xác thực refresh_token dùng 1 lần
 */
const generateCodeVerifyToken = () => {
    const code_verify_refresh_token = (0, crypto_1.randomBytes)(20).toString('hex');
    return code_verify_refresh_token;
};
exports.generateCodeVerifyToken = generateCodeVerifyToken;
const createPayload = (user) => {
    const { _id, user_email, user_roles } = user;
    const payload = {
        _id,
        user_email,
        user_roles
    };
    return payload;
};
exports.createPayload = createPayload;
const verifyAccessToken = ({ user, keyStore, client_id, token, key, req, res, next }) => {
    jsonwebtoken_1.default.verify(token, key, (error, decode) => {
        if (error) {
            if (req.originalUrl === '/v1/api/auth/logout') {
                req.user = user;
                return next();
            }
            return next(new response_error_1.AuthFailedError({ metadata: 'Token không đúng' }));
        }
        const payload = decode;
        if (payload._id !== client_id)
            return next(new response_error_1.BadRequestError({ metadata: 'Token không thuộc về user' }));
        req.user = user;
        req.keyStore = keyStore;
    });
    return next();
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = ({ user, keyStore, client_id, token, key, req, res, next }) => {
    const force = req.body.force;
    jsonwebtoken_1.default.verify(token, key, (error, decode) => {
        if (error) {
            return next(new response_error_1.ForbiddenError({ metadata: 'Token không đúng123' }));
        }
        const payload = decode;
        if (keyStore.refresh_token_used.includes(token)) {
            return next(new response_error_1.ForbiddenError({ metadata: 'Token đã được sử dụng' }));
        }
        if (payload._id !== client_id)
            return next(new response_error_1.BadRequestError({ metadata: 'Token không thuộc về user' }));
        req.user = user;
        req.keyStore = keyStore;
        req.refresh_token = token;
        return next();
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
const fillDataKeyModel = (user, public_key, private_key, refresh_token, code_verify_token) => {
    const modelKeyQuery = {
        user_id: user?._id
    };
    const modelKeyUpdate = {
        $set: { public_key, private_key, refresh_token, code_verify_token }
    };
    const modelKeyOption = { new: true, upsert: true };
    return { modelKeyQuery, modelKeyUpdate, modelKeyOption };
};
exports.fillDataKeyModel = fillDataKeyModel;
