"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formAnswer_controller_1 = __importDefault(require("../../controllers/formAnswer.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const routerFormAnswer = (0, express_1.Router)();
routerFormAnswer.post('/add-new-form-report', (0, asyncHandler_1.asyncHandler)(formAnswer_controller_1.default.addAnswerForm));
routerFormAnswer.use(authentication_1.default);
routerFormAnswer.get('/get-form-answer', (0, asyncHandler_1.asyncHandler)(formAnswer_controller_1.default.getFormAnswer));
exports.default = routerFormAnswer;
