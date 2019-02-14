import * as mongoose from "mongoose";
import config from "./index";

/**
 * Start mongnoDB connection.
 */
function startMongoConnection() {
    mongoose.connect(
        config.mongoURI,
        { useNewUrlParser: true },
        (err) => {
            if (err) {
                return console.log(`MongoERROR: ${err}`);
            }
        
            console.log('Mongo connected successfuly');
        }
    );
};

export default startMongoConnection;