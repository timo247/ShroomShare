import User from '../schemas/user.js';
import config from '../config.js';

const cleanUpDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
  ]);
};

export default cleanUpDatabase;
