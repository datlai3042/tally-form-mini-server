export const omit = (object, fields) => {
    const newObj = { ...object };
    for (let index = 0; index < fields.length; index++) {
        if (fields[index] in object) {
            delete newObj[fields[index]];
        }
    }
    return newObj;
};
export const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 ngày tính bằng miligiây
export const expriresAT = 3 * 1000; // 7 ngày tính bằng miligiây
export const setCookieResponse = (res, expires = oneWeek, name, value, options) => {
    const expiryDate = new Date(Date.now() + oneWeek);
    res.cookie(name, value, { ...options, expires: expiryDate, sameSite: 'none', path: '/', secure: true });
    return expiryDate;
};
