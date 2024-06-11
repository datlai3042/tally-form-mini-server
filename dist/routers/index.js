"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const account_1 = __importDefault(require("./account"));
const product_1 = __importDefault(require("./product"));
const form_core_1 = __importDefault(require("./form-core"));
const formAnswer_1 = __importDefault(require("./formAnswer"));
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => res.json({ message: 'xin chào' }));
router.use('/v1/api/auth', auth_1.default);
router.use('/v1/api/account', account_1.default);
router.use('/v1/api/product', product_1.default);
router.use('/v1/api/form', form_core_1.default);
router.use('/v1/api/form-answer', formAnswer_1.default);
exports.default = router;
