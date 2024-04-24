"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataResponse_utils_1 = require("../utils/dataResponse.utils");
class AccountService {
    static async me(req, res, next) {
        const { user } = req;
        const expireToken = (0, dataResponse_utils_1.setCookieResponse)(res, dataResponse_utils_1.expriresAT, 'test', 'success', { httpOnly: true });
        return { user };
    }
}
exports.default = AccountService;
