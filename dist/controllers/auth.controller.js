"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    static async register(req, res, next) {
        return new response_success_1.CREATE({ metadata: await auth_service_1.default.register(req, res, next) }).send(res);
    }
    static async login(req, res, next) {
        return new response_success_1.OK({ metadata: await auth_service_1.default.login(req, res, next) }).send(res);
    }
    static async logout(req, res, next) {
        return new response_success_1.OK({ metadata: await auth_service_1.default.logout(req, res, next) }).send(res);
    }
    static async refresh_token(req, res, next) {
        return new response_success_1.OK({ metadata: await auth_service_1.default.refresh_token(req, res, next) }).send(res);
    }
    //oAuth2
    static async oAuthWithGoogle(req, res, next) {
        return await auth_service_1.default.oAuthWithGoogle(req, res, next);
    }
}
exports.default = AuthController;
