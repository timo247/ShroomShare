import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/shroomshare';

function connect2Db() {
  mongoose.Promise = Promise;
  mongoose.connect(url, (err, db) => {
    if (err) {
      console.warn(`Could not connect to database because: ${err.message}`);
    } else {
      console.log('Connected to MongoDB');
    }
  });
}

export default connect2Db;
