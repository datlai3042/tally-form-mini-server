"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_config_1 = require("../../configs/cloudinary.config");
const account_controller_1 = __importDefault(require("../../controllers/account.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const routerAccount = (0, express_1.Router)();
routerAccount.use(authentication_1.default);
routerAccount.post('/upload-avatar', cloudinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateAvatar));
routerAccount.post('/update-email', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateEmail));
routerAccount.post('/update-password', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updatePassword));
routerAccount.get('/me', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.me));
exports.default = routerAccount;
