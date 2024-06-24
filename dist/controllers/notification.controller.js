"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const Notification_service_1 = __importDefault(require("../services/Notification.service"));
class NotificationController {
    static async getAllNotification(req, res, next) {
        return new response_success_1.OK({ metadata: await Notification_service_1.default.getAllNotification(req, res, next) }).send(res);
    }
    static async addNotificationSystem(req, res, next) {
        return new response_success_1.CREATE({ metadata: await Notification_service_1.default.addNotificationSystem(req, res, next) }).send(res);
    }
    static async addNotificationAccount(req, res, next) {
        return new response_success_1.CREATE({ metadata: await Notification_service_1.default.addNotificationAccount(req, res, next) }).send(res);
    }
    static async addNotificationFormAnswers(req, res, next) {
        return new response_success_1.CREATE({ metadata: await Notification_service_1.default.addNotificationFormAnswers(req, res, next) }).send(res);
    }
    static async getAllNotificationType(req, res, next) {
        return new response_success_1.OK({ metadata: await Notification_service_1.default.getAllNotificationType(req, res, next) }).send(res);
    }
    static async deleteNotificationItem(req, res, next) {
        return new response_success_1.OK({ metadata: await Notification_service_1.default.deleteNotificationItem(req, res, next) }).send(res);
    }
}
exports.default = NotificationController;
