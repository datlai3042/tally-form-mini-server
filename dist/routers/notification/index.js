"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../../controllers/notification.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const routerNotification = (0, express_1.Router)();
routerNotification.use(authentication_1.default);
routerNotification.get('/get-all-notification', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.getAllNotification));
routerNotification.get('/get-notification-type', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.getAllNotificationType));
routerNotification.post('/add-a-notification-system', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.addNotificationSystem));
routerNotification.post('/add-a-notification-account', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.addNotificationAccount));
routerNotification.post('/add-a-notification-form-answers', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.addNotificationFormAnswers));
routerNotification.delete('/delete-notification-item', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.deleteNotificationItem));
exports.default = routerNotification;
