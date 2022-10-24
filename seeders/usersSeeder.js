import bcrypt from 'bcrypt';
import config from '../config.js';
import User from '../schemas/user.js';

const numberOfUsers = 10;
const startIndex = 1;
const costFactor = config.bcryptCostFactor;

const seeder = async (i = startIndex) => {
  const user = await User.find({ username: `user0${i}` });
  if (user.length === 0) await createUser(i);
  if (i < numberOfUsers) await seeder(i + 1);
};

async function createUser(i) {
  const plainPassword = `password0${i}`;
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, costFactor);
    const user = new User({
      username: `user0${i}`,
      password: hashedPassword,
      admin: i % 2 === 0,
      email: `user0${i}@gmail.com`,
    });
    await user.save();
  } catch (error) {
    console.warn(`Could not create user because: ${error}`);
  }
}

export default seeder;
