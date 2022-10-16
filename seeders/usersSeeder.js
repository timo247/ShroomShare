import User from '../schemas/user.js';
import connexion from '../database-connector.js';

const numberOfUsers = 10;
const startIndex = 1;

async function seeder(i = startIndex) {
  const user = await User.find({ username: `user${i}` });
  if (user.length === 0) createUser(i);
  if (i < numberOfUsers) seeder(i + 1);
}

function createUser(i) {
  const user = new User({
    username: `user${i}`,
    password: `password${i}`,
    admin: i % 2 === 0,
    email: `user${i}@gmail.com`,
  });

  user.save((err, updatedUser) => {
    if (err) return console.warn(`Could not save user because: ${err.message}`);
    return console.log('user succesfully added to db');
  });
}

export default seeder;
