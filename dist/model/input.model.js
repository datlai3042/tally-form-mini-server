"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInputOptionModel = exports.coreInputOption = exports.coreInputEmailModel = exports.coreInputEmail = exports.coreInputTextModel = exports.coreInputText = exports.inputModel = exports.inputCoreSchema = void 0;
const mongoose_1 = require("mongoose");
exports.inputCoreSchema = new mongoose_1.Schema({
    type: { type: String, default: 'EMAIL' },
    input_title: { type: String },
    core: { type: mongoose_1.Schema.Types.Mixed, require: true }
}, { collection: 'inputcores', timestamps: true });
exports.inputModel = (0, mongoose_1.model)('InputCore', exports.inputCoreSchema);
exports.coreInputText = new mongoose_1.Schema({
    inputCore: { type: mongoose_1.Schema.Types.ObjectId, ref: 'InputCore' },
    setting: {
        input_error: { type: String, default: 'Email không hợp lệ', required: true },
        placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
        require: { type: Boolean, default: false },
        minLength: { type: Number, default: 8 },
        maxLength: { type: Number, default: 100 },
        input_color: { type: String, default: '#000000' },
        input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
        input_size: { type: Number, default: 16 }
    }
});
exports.coreInputTextModel = (0, mongoose_1.model)('InputTextCore', exports.coreInputText);
exports.coreInputEmail = new mongoose_1.Schema({
    inputCore: { type: mongoose_1.Schema.Types.ObjectId, ref: 'InputCore' },
    setting: {
        input_error: { type: String, default: 'Email không hợp lệ', required: true },
        placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
        require: { type: Boolean, default: false },
        minLength: { type: Number, default: 8 },
        maxLength: { type: Number, default: 100 },
        input_color: { type: String, default: '#000000' },
        input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
        input_size: { type: Number, default: 16 }
    }
});
exports.coreInputEmailModel = (0, mongoose_1.model)('InputEmailCore', exports.coreInputEmail);
exports.coreInputOption = new mongoose_1.Schema({
    inputCore: { type: mongoose_1.Schema.Types.ObjectId, ref: 'InputCore' },
    setting: {
        input_error: { type: String, default: 'Email không hợp lệ', required: true },
        placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
        require: { type: Boolean, default: false },
        minLength: { type: Number, default: 8 },
        maxLength: { type: Number, default: 100 },
        input_color: { type: String, default: '#000000' },
        input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
        input_size: { type: Number, default: 16 }
    }
});
exports.coreInputOptionModel = (0, mongoose_1.model)('InputOptionCore', exports.coreInputOption);
