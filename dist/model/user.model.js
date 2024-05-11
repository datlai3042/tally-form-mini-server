import { Schema, model } from 'mongoose';
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';
const userSchema = new Schema({
    user_email: { type: String, required: true },
    user_password: { type: String, required: true },
    user_first_name: { type: String, required: true },
    user_last_name: { type: String, required: true },
    user_birthday: { type: Date },
    user_gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'MALE', required: true },
    user_roles: { type: String, enum: ['USER', 'ADMIN', 'GUEST'], default: 'USER', required: true },
    user_avatar_system: { type: String, default: '123', required: true },
    user_avatar_current: { type: { secure_url: String, public_id: String, date: Date } },
    user_avater_used: {
        type: [
            {
                secure_url: String,
                public_id: String,
                date: Date
            }
        ],
        default: []
    }
}, { collection: COLLECTION_NAME, timestamps: true });
const userModel = model(DOCUMENT_NAME, userSchema);
export default userModel;
