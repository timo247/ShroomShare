import mongoose from 'mongoose';

function connect2Db() {
  mongoose.Promise = Promise;
  mongoose.connect(process.env.DATABASE_URL, (err, db) => {
    if (err) {
      console.warn(`Could not connect to database because: ${err.message}`);
    } else {
      console.log('Connected to MongoDB');
    }
  });
}

export default connect2Db;
