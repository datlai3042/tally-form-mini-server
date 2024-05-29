"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSchema = void 0;
const mongoose_1 = require("mongoose");
const input_model_1 = require("./input.model");
const DOCUMENT_NAME = 'Form';
const COLLECTION_NAME = 'forms';
exports.formSchema = new mongoose_1.Schema({
    form_owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    form_title: { type: String },
    form_avatar: { type: { form_avatar_url: String, form_avatar_publicId: String } },
    form_background: {
        type: {
            form_background_iamge_url: String,
            form_backround_image_publicId: String
        }
    },
    form_avatar_state: { type: Boolean, default: false },
    form_background_state: { type: Boolean, default: false },
    form_state: { type: String, enum: ['isDraff', 'isPublic', 'isPrivate'], default: 'isDraff' },
    form_setting_default: {
        type: {
            form_background_default_url: String,
            form_avatar_default_url: String
        },
        default: {
            form_background_default_url: 'https://res.cloudinary.com/cloud304/image/upload/v1715055931/tally_form_project/setting_default/icvxveiuj5xysby3yzco.jpg',
            form_avatar_default_url: 'https://res.cloudinary.com/cloud304/image/upload/v1715055937/tally_form_project/setting_default/aanihty5eiravlosapmv.jpg'
        }
    },
    form_inputs: { type: [input_model_1.inputTextSchema, input_model_1.inputEmailSchema, input_model_1.inputDateSchema] },
    form_button_label: { type: String, default: 'Submit' }
}, { collection: COLLECTION_NAME, timestamps: true });
const formModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.formSchema);
exports.default = formModel;
