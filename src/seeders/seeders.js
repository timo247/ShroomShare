import mongoose from 'mongoose';
import userSeeder from './usersSeeder.js';
import connection from '../helpers/useDbConnector.js';
import speciesSeeder from './speciesSeeder.js'
import User from '../schemas/user.js';

connection();
await Promise.all([
  User.deleteMany(),
]);
// call seeder here
//await userSeeder();
await speciesSeeder();
await mongoose.connection.close();
process.exit();
