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
const accountRouter = (0, express_1.Router)();
accountRouter.use(authentication_1.default);
accountRouter.post('/update-avatar', cloudinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateAvatar));
accountRouter.post('/update-email', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateEmail));
accountRouter.post('/update-password', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updatePassword));
accountRouter.get('/me', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.me));
exports.default = accountRouter;
