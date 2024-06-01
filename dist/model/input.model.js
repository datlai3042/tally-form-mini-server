"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputDateSchema = exports.inputTextSchema = exports.inputEmailSchema = void 0;
const mongoose_1 = require("mongoose");
exports.inputEmailSchema = new mongoose_1.Schema({
    type: { type: String, default: 'EMAIL' },
    input_heading: { type: String },
    input_heading_type: { type: String },
    setting: {
        type: {
            input_error: { type: String, default: 'Email không hợp lệ', required: true },
            placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
            require: { type: Boolean, default: false },
            minLength: { type: Number, default: 8 },
            maxLength: { type: Number, default: 100 },
            input_color: { type: String, default: '#000000' },
            input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
            input_size: { type: Number, default: 16 }
        }
    }
});
exports.inputTextSchema = new mongoose_1.Schema({
    type: { type: String, default: 'TEXT' },
    input_heading: { type: String },
    input_heading_type: { type: String },
    setting: {
        type: {
            input_error: { type: String, default: 'Nội dung không hợp lệ', required: true },
            placeholder: { type: String, default: 'Nhập nội dung của bạn', required: true },
            require: { type: Boolean, default: false },
            minLength: { type: Number, default: 8 },
            maxLength: { type: Number, default: 100 },
            input_color: { type: String, default: '#000000' },
            input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
            input_size: { type: Number, default: 16 }
        }
    }
});
exports.inputDateSchema = new mongoose_1.Schema({
    type: { type: String, default: 'Date' },
    date_type: { type: String, default: 'Any' },
    // input_error: { type: String, default: 'Ngày không hợp lệ' },
    input_heading: { type: String },
    input_heading_type: { type: String },
    conditions: { type: { date_time: Number, require: Boolean } }
});
