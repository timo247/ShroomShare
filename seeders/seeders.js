import mongoose from 'mongoose';
import userSeeder from './usersSeeder.js';
import connection from '../database-connector.js';

connection();
// call seeder here
await userSeeder();
//await mongoose.connection.close();
//process.exit();
