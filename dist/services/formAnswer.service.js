"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formAnswer_model_1 = __importDefault(require("../model/formAnswer.model"));
class FormAnswerService {
    static async addAnswerForm(req, res, next) {
        const { formAnswer } = req.body;
        const formAnswerQuery = { form_id: formAnswer.form_id, owner_id: formAnswer.form_owner };
        const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } };
        const formAnswerOption = { new: true, upsert: true };
        const findFormOrigin = await formAnswer_model_1.default.findOneAndUpdate(formAnswerQuery, formAnswerUpdate, formAnswerOption);
        const socketOwnerForm = global._userSocket[findFormOrigin?.owner_id];
        console.log({ user: global._userSocket, socketOwnerForm });
        if (socketOwnerForm) {
            console.log({ emit: global._userSocket[findFormOrigin?.owner_id] });
            global._io
                .to(global._userSocket[findFormOrigin?.owner_id].socket_id)
                .emit('add-new-reports', { type: 'Answer', formAnswer: findFormOrigin });
        }
        return { message: 'Gửi thành công' };
    }
    static async getFormAnswer(req, res, next) {
        const { form_id } = req.query;
        const { user } = req;
        const formAnswerQuery = { form_id: form_id, owner_id: user?._id };
        // const formAnswerUpdate = { $push: { reports: { form_id: formAnswer.form_id, answers: formAnswer.answers } } }
        // const formAnswerOption = { new: true, upsert: true }
        const findFormOrigin = await formAnswer_model_1.default.findOne(formAnswerQuery);
        return { formAnswer: findFormOrigin };
    }
}
exports.default = FormAnswerService;
