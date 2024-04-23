"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const product_service_1 = __importDefault(require("../services/product.service"));
class ProductController {
    static async getProduct(res) {
        return new response_success_1.OK({ metadata: await product_service_1.default.getProduct() }).send(res);
    }
}
exports.default = ProductController;
