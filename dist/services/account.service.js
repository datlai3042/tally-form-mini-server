"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountService {
    static async me(req, res, next) {
        console.log('api request');
        const { user } = req;
        // console.log({ user })
        return { user };
    }
}
exports.default = AccountService;
