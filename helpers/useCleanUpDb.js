import User from '../schemas/user.js';

const cleanUpDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
  ]);
};

export default cleanUpDatabase;
