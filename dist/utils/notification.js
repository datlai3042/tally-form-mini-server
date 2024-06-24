"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_model_1 = require("../model/notification.model");
const createANotification = async ({ user_id, type, core }) => {
    const notification = await notification_model_1.notificationModel.create({ type, core });
    const notification_user_query = { notification_user_id: user_id };
    const notification_user_update = { $push: { notifications: notification } };
    const notification_options = { new: true, upsert: true };
    const notificationCore = await notification_model_1.notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options);
    return { notifications: notificationCore, notification_item_id: notification._id };
};
exports.default = createANotification;
