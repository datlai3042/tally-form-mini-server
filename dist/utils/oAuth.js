"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUser = exports.getOAuthGoogleToken = void 0;
const axios_1 = __importDefault(require("axios"));
const getOAuthGoogleToken = async ({ code }) => {
    const body = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
        grant_type: 'authorization_code'
    };
    const url_origin = 'https://oauth2.googleapis.com/token';
    const options = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } };
    const { data } = await axios_1.default.post(url_origin, body, options);
    console.log({ data });
    return data;
};
exports.getOAuthGoogleToken = getOAuthGoogleToken;
const getGoogleUser = async ({ id_token, access_token }) => {
    const url_origin = 'https://www.googleapis.com/oauth2/v1/userinfo';
    const options = {
        params: {
            access_token,
            alt: 'json'
        },
        headers: {
            Authorization: `Bearer ${id_token}`
        }
    };
    const { data } = await axios_1.default.get(url_origin, options);
    console.log({ data });
    return data;
};
exports.getGoogleUser = getGoogleUser;
