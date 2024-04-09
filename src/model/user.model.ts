import { Document, Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

type Gender = 'MALE' | 'FEMALE' | 'OTHER'
type Clondinary = {
      secure_url: string
      public_id: string
}

type UserRole = 'USER' | 'ADMIN' | 'GUEST'

type UserAvatar = Clondinary & {
      date: Date
}

export type UserSchema = {
      user_email: string
      user_password: string
      user_birthday: Date
      user_gender: Gender
      user_roles: UserRole
      user_avatar_system: string
      user_avatar_current: UserAvatar
      user_avater_used: UserAvatar[]
}

export type UserDocument = Document & UserSchema

const userSchema = new Schema<UserDocument>(
      {
            user_email: { type: String, required: true },
            user_password: { type: String, required: true },
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
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const userModel = model<UserSchema>(DOCUMENT_NAME, userSchema)

export default userModel
