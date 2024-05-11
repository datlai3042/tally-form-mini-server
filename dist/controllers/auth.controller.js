import { CREATE, OK } from '../Core/response.success.js';
import AuthService from '../services/auth.service.js';
class AuthController {
    static async register(req, res, next) {
        return new CREATE({ metadata: await AuthService.register(req, res, next) }).send(res);
    }
    static async login(req, res, next) {
        return new OK({ metadata: await AuthService.login(req, res, next) }).send(res);
    }
    static async logout(req, res, next) {
        return new OK({ metadata: await AuthService.logout(req, res, next) }).send(res);
    }
    static async refresh_token(req, res, next) {
        return new OK({ metadata: await AuthService.refresh_token(req, res, next) }).send(res);
    }
}
export default AuthController;
