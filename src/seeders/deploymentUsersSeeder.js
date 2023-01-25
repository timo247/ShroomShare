import bcrypt from 'bcrypt';
import config from '../../config.js';
import User from '../schemas/user.js';

const numberOfUsers = 10;
const startIndex = 1;
const costFactor = config.bcryptCostFactor;

const seeder = async (i = startIndex) => {
  const user = await User.find({ username: `user0${i}` });
  if (user.length === 0) await createUser(i);
  if (i < numberOfUsers) await seeder(i + 1);
  if (i === numberOfUsers) await createAdmins();
};

async function createUser(i) {
  const plainPassword = `password0${i}`;
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, costFactor);
    const user = new User({
      username: `user0${i}`,
      password: hashedPassword,
      admin: false,
      email: `user0${i}@gmail.com`,
    });
    await user.save();
  } catch (error) {
    console.warn(`Could not create user because: ${error}`);
  }
}

async function createAdmins() {
  try {
    const plainPassword1 = 'ShroomShareAdminPw1';
    const plainPassword2 = 'ShroomShareAdminPw2';
    const hashedPassword1 = await bcrypt.hash(plainPassword1, costFactor);
    const hashedPassword2 = await bcrypt.hash(plainPassword2, costFactor);
    const admin1 = new User({
      username: 'Admin1',
      password: hashedPassword1,
      admin: 1,
      email: 'admin1@shroom-share.com',
    });
    const admin2 = new User({
      username: 'Admin2',
      password: hashedPassword2,
      admin: 1,
      email: 'admin2@shroom-share.com',
    });
    await admin1.save();
    await admin2.save();
  } catch (error) {
    console.warn(`Could not create user because: ${error}`);
  }
}

export default seeder;
