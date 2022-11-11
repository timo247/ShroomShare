import User from '../schemas/user.js';
import Image from '../schemas/images.js';
import Specy from '../schemas/species.js';
import config from '../../config.js';

const cleanUpDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
    Image.deleteMany(),
    Specy.deleteMany(),
  ]);
};

export default cleanUpDatabase;
