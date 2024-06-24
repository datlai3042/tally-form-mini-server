"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInputSettingWithType = void 0;
const input_constants_1 = require("../constants/input.constants");
const generateInputSettingWithType = (type, form, inputItem) => {
    let core = {};
    switch (type) {
        case 'TEXT': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingText } });
        }
        case 'EMAIL': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingEmail } });
        }
        case 'VOTE': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingVote } });
        }
        case 'PHONE': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingPhone } });
        }
        case 'TEXT': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingText } });
        }
        case 'OPTION': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingOption }, options: [] });
        }
        case 'OPTION_MULTIPLE': {
            const setting_default = (0, input_constants_1.generateInputSettingDefault)(form, inputItem);
            return (core = { setting: { ...setting_default, ...input_constants_1.inputSettingOption }, options: [] });
        }
    }
    return core;
};
exports.generateInputSettingWithType = generateInputSettingWithType;
