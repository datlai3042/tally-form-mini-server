"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInputSettingDefault = exports.inputSettingPhone = exports.inputSettingVote = exports.inputSettingOption = exports.inputSettingEmail = exports.inputSettingText = void 0;
const inputSettingCommon = {
    require: false,
    input_error: 'Nội dung không hợp lệ',
    input_color: '#000000',
    input_size: 16,
    input_style: 'normal'
};
exports.inputSettingText = {
    maxLength: 100,
    placeholder: 'Nhập nội dung của bạn',
    minLength: 1,
    ...inputSettingCommon
};
exports.inputSettingEmail = {
    maxLength: 100,
    placeholder: 'Nhập email của bạn',
    minLength: 5,
    ...inputSettingCommon
};
exports.inputSettingOption = {
    ...inputSettingCommon
};
exports.inputSettingVote = {
    ...inputSettingCommon
};
exports.inputSettingPhone = {
    ...inputSettingCommon
};
const generateInputSettingDefault = (form, inputItem) => {
    const style = {
        input_color: form.form_setting_default.input_color || inputItem.core.setting.input_color,
        input_size: form.form_setting_default.input_size || inputItem.core.setting.input_size,
        input_style: form.form_setting_default.input_style || inputItem.core.setting.input_style
    };
    return style;
};
exports.generateInputSettingDefault = generateInputSettingDefault;
