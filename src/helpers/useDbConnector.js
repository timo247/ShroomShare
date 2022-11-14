import mongoose from 'mongoose';
import config from '../../config.js';

const debugErrors = config.debug.apiErrors;
const debugSucces = config.debug.apiSucces;

async function connect2Db() {
  mongoose.Promise = Promise;
  mongoose.set('debug', true);
  mongoose.connect(process.env.DATABASE_URL, (err, db) => {
    if (err) {
      debugErrors(`Could not connect to database because: ${err.message}`);
    } else {
      debugSucces('Connected to MongoDB');
    }
  });
}

export default connect2Db;
