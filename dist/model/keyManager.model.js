"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'keyStores';
const keyManagerSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    public_key: { type: String, required: true },
    private_key: { type: String, required: true },
    code_verify_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    refresh_token_used: { type: [String], required: true }
}, { collection: COLLECTION_NAME, timestamps: true });
const keyManagerModel = (0, mongoose_1.model)(DOCUMENT_NAME, keyManagerSchema);
exports.default = keyManagerModel;
