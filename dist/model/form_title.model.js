"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formTitleSubModel = exports.generateSubTitleType = exports.generateCoreFullDescriptionObject = exports.generateCoreImageObject = exports.generateCoreTextObject = exports.formTitleSubSchema = void 0;
const mongoose_1 = require("mongoose");
exports.formTitleSubSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['Text', 'FullDescription', 'Image'], default: 'Text' },
    form_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', require: true },
    core: { type: mongoose_1.Schema.Types.Mixed }
});
const generateCoreTextObject = ({ value }) => {
    return {
        value
    };
};
exports.generateCoreTextObject = generateCoreTextObject;
const generateCoreImageObject = ({ url }) => {
    return {
        url
    };
};
exports.generateCoreImageObject = generateCoreImageObject;
const generateCoreFullDescriptionObject = ({ header_value, value }) => {
    return {
        header_value,
        value
    };
};
exports.generateCoreFullDescriptionObject = generateCoreFullDescriptionObject;
const generateSubTitleType = ({ type, form_id }) => {
    switch (type) {
        case 'Text':
            const text = {
                type,
                form_id
            };
            return text;
        case 'Image':
            const image = {
                type,
                form_id
            };
            return image;
        case 'FullDescription':
            const fullDescription = {
                type,
                form_id
            };
            return fullDescription;
    }
};
exports.generateSubTitleType = generateSubTitleType;
exports.formTitleSubModel = (0, mongoose_1.model)('FormTitleSub', exports.formTitleSubSchema);
