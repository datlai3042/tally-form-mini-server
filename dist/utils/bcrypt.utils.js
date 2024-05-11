import bcrypt from 'bcrypt';
const SALT = 10;
/**
 *
 * @param password -> Mật khẩu hiện tại
 * @returns -> Mật khẩu sau khi đã băm
 */
export const hassPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
};
/**
 *
 * @param passwordForm -> Mật khẩu từ Form gửi lên
 * @param userPassword -> Mật khẩu đã được bâm trong db
 * @returns -> boolean
 */
export const compare = (passwordForm, userPassword) => {
    return bcrypt.compareSync(passwordForm, userPassword);
};
