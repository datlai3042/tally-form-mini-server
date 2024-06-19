"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formAnswerMiniModel = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'FormAnswer';
const COLLECTION_NAME = 'formAnswers';
const inputData = new mongoose_1.Schema({
    _id: { type: String, required: true },
    mode: { type: String, enum: ['Require', 'Optional'] },
    title: { type: String, required: true },
    type: { type: String, enum: ['TEXT', 'IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION'] },
    value: { type: mongoose_1.Schema.Types.Mixed }
});
const formAnswer = new mongoose_1.Schema({
    form_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: { type: [inputData], default: [] },
    create_time: { type: Date, default: Date.now }
}, { collection: 'formAnswerItem', timestamps: true });
exports.formAnswerMiniModel = (0, mongoose_1.model)('FormAnswerItem', formAnswer);
const formAnswerOrigin = new mongoose_1.Schema({
    form_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', required: true },
    owner_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reports: { type: [formAnswer], default: [] }
}, { collection: COLLECTION_NAME, timestamps: true });
const formAnswerModel = (0, mongoose_1.model)(DOCUMENT_NAME, formAnswerOrigin);
exports.default = formAnswerModel;
