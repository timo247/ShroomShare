import User from '../schemas/user.js';
import Image from '../schemas/images.js';
import Specy from '../schemas/species.js';
import Mushroom from '../schemas/mushroom.js';

const cleanUpDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
    Image.deleteMany(),
    Specy.deleteMany(),
    Mushroom.deleteMany(),
  ]);
};

export default cleanUpDatabase;
