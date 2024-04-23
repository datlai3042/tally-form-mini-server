"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const account_service_1 = __importDefault(require("../../services/account.service"));
const routerAccount = (0, express_1.Router)();
routerAccount.use(authentication_1.default);
routerAccount.get('/me', account_service_1.default.me);
exports.default = routerAccount;
