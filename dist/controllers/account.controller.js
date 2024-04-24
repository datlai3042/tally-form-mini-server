"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const account_service_1 = __importDefault(require("../services/account.service"));
class AccountController {
    static async me(req, res, next) {
        return new response_success_1.OK({ metadata: await account_service_1.default.me(req, res, next) }).send(res);
    }
}
exports.default = AccountController;
