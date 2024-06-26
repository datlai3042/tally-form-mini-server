"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_model_1 = __importDefault(require("../model/form.model"));
const formAnswer_model_1 = __importStar(require("../model/formAnswer.model"));
const notification_1 = __importDefault(require("../utils/notification"));
class FormAnswerService {
    static async addAnswerForm(req, res, next) {
        const { formAnswer } = req.body;
        const found_form_origin = await form_model_1.default.findOne({ _id: formAnswer.form_id }).select('form_title form_avatar form_setting_default');
        const oneAnswerData = await formAnswer_model_1.oneAnswer.create({ form_id: formAnswer.form_id, answers: formAnswer.answers });
        const formAnswerQuery = { form_id: formAnswer.form_id, owner_id: formAnswer.form_owner };
        const formAnswerUpdate = { $push: { reports: oneAnswerData._id } };
        const formAnswerOption = { new: true, upsert: true };
        const findFormOrigin = await formAnswer_model_1.default.findOneAndUpdate(formAnswerQuery, formAnswerUpdate, formAnswerOption).populate('reports');
        const socketOwnerForm = global._userSocket[findFormOrigin?.owner_id];
        const createNotification = await (0, notification_1.default)({
            user_id: findFormOrigin?.owner_id,
            type: 'Form_Answers',
            core: {
                message: `bạn đã nhận 1 phiếu trả lời`,
                form_id: findFormOrigin?.form_id,
                form_answer_id: oneAnswerData._id
            }
        });
        createNotification.notifications.notifications = createNotification.notifications?.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime());
        if (socketOwnerForm) {
            global._io.to(global._userSocket[findFormOrigin?.owner_id].socket_id).emit('add-new-reports', {
                type: 'Answer',
                formAnswer: findFormOrigin,
                notification: createNotification.notifications,
                notification_item_id: createNotification.notification_item_id,
                form_origin: found_form_origin
            });
        }
        return { message: 'Gửi thành công' };
    }
    static async getFormAnswer(req, res, next) {
        const { form_id } = req.query;
        const { user } = req;
        const formAnswerQuery = { form_id: form_id, owner_id: user?._id };
        // const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } }
        // const formAnswerOption = { new: true, upsert: true }
        const findFormOrigin = await formAnswer_model_1.default.findOne(formAnswerQuery).populate('reports');
        return { formAnswer: findFormOrigin };
    }
}
exports.default = FormAnswerService;
