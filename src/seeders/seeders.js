import mongoose from 'mongoose';
import userSeeder from './usersSeeder.js';
import connection from '../helpers/useDbConnector.js';
import User from '../schemas/user.js';

connection();
await Promise.all([
  User.deleteMany(),
]);
// call seeder here
await userSeeder();
await mongoose.connection.close();
process.exit();
