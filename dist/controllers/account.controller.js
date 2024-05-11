import { CREATE, OK } from '../Core/response.success.js';
import AccountService from '../services/account.service.js';
class AccountController {
    static async me(req, res, next) {
        return new OK({ metadata: await AccountService.me(req, res, next) }).send(res);
    }
    static async updateAvatar(req, res, next) {
        return new CREATE({ metadata: await AccountService.updateAvatar(req, res, next) }).send(res);
    }
    static async updateEmail(req, res, next) {
        return new OK({ metadata: await AccountService.updateEmail(req, res, next) }).send(res);
    }
    static async updatePassword(req, res, next) {
        return new OK({ metadata: await AccountService.updatePassword(req, res, next) }).send(res);
    }
}
export default AccountController;
