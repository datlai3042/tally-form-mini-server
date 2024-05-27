"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountRepository {
    static async findOneUser(user) {
        const userQueryDoc = { _id: user?._id };
        const userOptionDoc = { new: true, upsert: true };
    }
}
exports.default = AccountRepository;
