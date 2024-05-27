"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hassPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT = 10;
/**
 *
 * @param password -> Mật khẩu hiện tại
 * @returns -> Mật khẩu sau khi đã băm
 */
const hassPassword = async (password) => {
    return await bcrypt_1.default.hash(password, SALT);
};
exports.hassPassword = hassPassword;
/**
 *
 * @param passwordForm -> Mật khẩu từ Form gửi lên
 * @param userPassword -> Mật khẩu đã được bâm trong db
 * @returns -> boolean
 */
const compare = (passwordForm, userPassword) => {
    return bcrypt_1.default.compareSync(passwordForm, userPassword);
};
exports.compare = compare;
