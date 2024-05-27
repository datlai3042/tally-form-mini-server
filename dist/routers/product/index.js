"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const routerProduct = (0, express_1.Router)();
routerProduct.use(authentication_1.default);
routerProduct.get('/get-all-product', (req, res, next) => res.json('Đã lấy tất cả sản phẩm'));
exports.default = routerProduct;
