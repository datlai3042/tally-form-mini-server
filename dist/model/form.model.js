import { Schema, model } from 'mongoose';
import { inputDateSchema, inputEmailSchema, inputTextSchema } from './input.model.js';
const DOCUMENT_NAME = 'Form';
const COLLECTION_NAME = 'forms';
export const formSchema = new Schema({
    form_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    form_title: { type: String },
    form_avatar: { type: { form_avatar_url: String } },
    form_background: {
        type: {
            form_background_iamge_url: String
        }
    },
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
    form_inputs: { type: [inputTextSchema, inputEmailSchema, inputDateSchema] },
    form_button_label: { type: String, default: 'Submit' }
}, { collection: COLLECTION_NAME, timestamps: true });
const formModel = model(DOCUMENT_NAME, formSchema);
export default formModel;
