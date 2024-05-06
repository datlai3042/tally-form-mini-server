import { UserDocument } from '~/model/user.model'

class AccountRepository {
      static async findOneUser(user: UserDocument) {
            const userQueryDoc = { _id: user?._id }

            const userOptionDoc = { new: true, upsert: true }
      }
}

export default AccountRepository
