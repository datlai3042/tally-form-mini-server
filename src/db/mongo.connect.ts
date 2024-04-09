import mongoose, { Mongoose } from 'mongoose'
import { config } from 'dotenv'

config()

class MongoConnect {
      static connect: Promise<Mongoose>
      static async Connect(): Promise<Mongoose> {
            if (!MongoConnect.connect) {
                  MongoConnect.connect = mongoose.connect(process.env.MONGO_URI as string)

                  MongoConnect.connect
                        .then(() => console.log('Database is connection success'))
                        .catch((e) => console.log(`Database is connection false with error::${e}`))

                  return MongoConnect.connect
            }

            return MongoConnect.connect
      }
}

export default MongoConnect
