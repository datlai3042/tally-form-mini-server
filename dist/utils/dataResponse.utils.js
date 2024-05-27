"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookieResponse = exports.expriresAT = exports.oneWeek = exports.omit = void 0;
const omit = (object, fields) => {
    const newObj = { ...object };
    for (let index = 0; index < fields.length; index++) {
        if (fields[index] in object) {
            delete newObj[fields[index]];
        }
    }
    return newObj;
};
exports.omit = omit;
exports.oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 ngày tính bằng miligiây
exports.expriresAT = 3 * 1000; // 7 ngày tính bằng miligiây
const setCookieResponse = (res, expires = exports.oneWeek, name, value, options) => {
    const expiryDate = new Date(Date.now() + exports.oneWeek);
    res.cookie(name, value, { ...options, expires: expiryDate, sameSite: 'none', path: '/', secure: true });
    return expiryDate;
};
exports.setCookieResponse = setCookieResponse;
