"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
const account_1 = __importDefault(require("./account"));
const router = (0, express_1.Router)();
router.use('/v1/api/auth', auth_1.default);
router.use('/v1/api/account', account_1.default);
router.use('/v1/api/product', product_1.default);
exports.default = router;
