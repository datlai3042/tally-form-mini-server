import { Schema, model } from 'mongoose';
const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'keyStores';
const keyManagerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    public_key: { type: String, required: true },
    private_key: { type: String, required: true },
    code_verify_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    refresh_token_used: { type: [String], required: true }
}, { collection: COLLECTION_NAME, timestamps: true });
const keyManagerModel = model(DOCUMENT_NAME, keyManagerSchema);
export default keyManagerModel;
