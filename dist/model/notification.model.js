"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationUserModel = exports.notificationModel = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications';
const notificationSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['System', 'Account', 'Form_Answers'], default: 'System' },
    core: { type: mongoose_1.Schema.Types.Mixed, required: true },
    create_time: { type: Date, default: Date.now }
}, { collection: COLLECTION_NAME, timestamps: true });
exports.notificationModel = (0, mongoose_1.model)(DOCUMENT_NAME, notificationSchema);
const notificationUserSchema = new mongoose_1.Schema({
    notification_user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    notifications: [notificationSchema]
}, { collection: 'notification_user', timestamps: true });
exports.notificationUserModel = (0, mongoose_1.model)('Notification_User', notificationUserSchema);
