"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_model_1 = require("../model/notification.model");
class NotificationService {
    static async getAllNotification(req, res, next) {
        const { user } = req;
        const notification_user_query = { notification_user_id: user?._id };
        const notifications = await notification_model_1.notificationUserModel.findOne(notification_user_query);
        if (!notifications) {
            return { notifications: [] };
        }
        notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime());
        return { notification_user: notifications };
    }
    static async addNotificationSystem(req, res, next) {
        const { user } = req;
        const { type = 'System', message } = req.body;
        const notification = await notification_model_1.notificationModel.create({ type, core: { message } });
        const notification_user_query = { notification_user_id: user?._id };
        const notification_user_update = { $push: { notifications: notification } };
        const notification_options = { new: true, upsert: true };
        const notificationCore = await notification_model_1.notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options);
        return { notifications: notificationCore };
    }
    static async addNotificationAccount(req, res, next) {
        const { user } = req;
        const { type = 'Account', message } = req.body;
        const notification = await notification_model_1.notificationModel.create({ type, core: { message } });
        const notification_user_query = { notification_user_id: user?._id };
        const notification_user_update = { $push: { notifications: notification } };
        const notification_options = { new: true, upsert: true };
        const notificationCore = await notification_model_1.notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options);
        return { notifications: notificationCore };
    }
    static async addNotificationFormAnswers(req, res, next) {
        const { user } = req;
        const { type = 'Form_Answers', core } = req.body;
        const notification = await notification_model_1.notificationModel.create({ type, core });
        const notification_user_query = { notification_user_id: user?._id };
        const notification_user_update = { $push: { notifications: notification } };
        const notification_options = { new: true, upsert: true };
        const notificationCore = await notification_model_1.notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options);
        return { notifications: notificationCore };
    }
    static async getAllNotificationType(req, res, next) {
        const { user } = req;
        const { type, page, limit } = req.query;
        if (type === 'All') {
            const notifications = await notification_model_1.notificationUserModel.findOne({ notification_user_id: user?._id });
            if (!notifications)
                return { notification_user: { notifications: [] } };
            const START = (page - 1) * limit;
            const END = page * limit;
            notifications.notifications = notifications.notifications.slice(START, END);
            notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime());
            return { notification_user: notifications };
        }
        const notifications = await notification_model_1.notificationUserModel.findOne({ notification_user_id: user?._id, 'notifications.type': type });
        if (!notifications)
            return { notification_user: { notifications: [] } };
        notifications.notifications = notifications.notifications.filter((notification) => {
            if (notification.type === type)
                return notification;
            return null;
        });
        const START = (page - 1) * limit;
        const END = page * limit;
        notifications.notifications = notifications.notifications.slice(START, END);
        notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime());
        return { notification_user: notifications };
    }
    static async deleteNotificationItem(req, res, next) {
        const { user } = req;
        const { notification_id } = req.query;
        await notification_model_1.notificationModel.findOneAndDelete({ _id: notification_id });
        const notification_user_query = { notification_user_id: user?._id };
        const notifications = await notification_model_1.notificationUserModel.findOne(notification_user_query);
        notifications.notifications = notifications?.notifications.filter((notification) => {
            if (notification._id == notification_id) {
                return null;
            }
            return notification;
        });
        console.log(notifications?.notifications, notification_id);
        await notifications.save();
        return { notification_user: notifications };
    }
}
exports.default = NotificationService;
