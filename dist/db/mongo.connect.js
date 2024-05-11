import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
class MongoConnect {
    static connect;
    static async Connect() {
        if (!MongoConnect.connect) {
            MongoConnect.connect = mongoose.connect(process.env.MODE === 'DEV' ? process.env.MONGO_LOCAL : process.env.MONGO_URI);
            MongoConnect.connect
                .then(() => console.log('Database is connection success'))
                .catch((e) => console.log(`Database is connection false with error::${e}`));
            return MongoConnect.connect;
        }
        return MongoConnect.connect;
    }
}
export default MongoConnect;
