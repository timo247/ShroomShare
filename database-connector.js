import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/shroomshare';

function connectDb() {
  mongoose.Promise = Promise;
  mongoose.connect(url, (err, db) => {
    if (err) {
      console.warn(`Could not connect to database because: ${err.message}`);
    } else {
      console.log('Connected to MongoDB');
    }
  });
}

/* const connection = connectDb(); */

export default connectDb;
