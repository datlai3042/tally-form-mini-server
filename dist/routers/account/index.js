"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = __importDefault(require("../../controllers/account.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const routerAccount = (0, express_1.Router)();
routerAccount.use(authentication_1.default);
routerAccount.get('/me', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.me));
exports.default = routerAccount;
