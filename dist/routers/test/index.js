"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_controller_js_1 = __importDefault(require("../../controllers/form.controller.js"));
const asyncHandler_js_1 = require("../../helpers/asyncHandler.js");
const authentication_js_1 = __importDefault(require("../../middlewares/authentication.js"));
const routerForm = (0, express_1.Router)();
routerForm.get('/find-form-guess', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.getFormGuess));
routerForm.use(authentication_js_1.default);
routerForm.get('/get-forms', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.getForms));
routerForm.get('/get-form-id', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.getFormId));
routerForm.get('/find-form', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.getFormUpdate));
routerForm.post('/create-form', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.createForm));
routerForm.post('/update-form', (0, asyncHandler_js_1.asyncHandler)(form_controller_js_1.default.updateForm));
exports.default = routerForm;
