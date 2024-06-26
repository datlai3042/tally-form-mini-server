"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneAnswer = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'FormAnswerCore';
const COLLECTION_NAME = 'formAnswersCore';
const inputData = new mongoose_1.Schema({
    _id: { type: String, required: true },
    mode: { type: String, enum: ['Require', 'Optional'] },
    title: { type: String, required: true },
    type: { type: String, enum: ['TEXT', 'IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION', 'VOTE', 'PHONE'] },
    value: { type: mongoose_1.Schema.Types.Mixed },
    one_answer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'OneAnswer', require: true }
});
const formAnswer = new mongoose_1.Schema({
    form_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: { type: [inputData], default: [] },
    create_time: { type: Date, default: Date.now },
    form_answer_core_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'FormAnswer', require: true }
}, { collection: 'formAnswerItem', timestamps: true });
exports.oneAnswer = (0, mongoose_1.model)('OneAnswer', formAnswer);
const formAnswerOrigin = new mongoose_1.Schema({
    form_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', required: true },
    owner_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reports: { type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'OneAnswer' }], default: [] }
}, { collection: COLLECTION_NAME, timestamps: true });
const formAnswerCore = (0, mongoose_1.model)(DOCUMENT_NAME, formAnswerOrigin);
exports.default = formAnswerCore;
