class AccountRepository {
    static async findOneUser(user) {
        const userQueryDoc = { _id: user?._id };
        const userOptionDoc = { new: true, upsert: true };
    }
}
export default AccountRepository;
