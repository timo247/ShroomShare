import mongoose from 'mongoose';
import userSeeder from './usersSeeder.js';
import connection from '../database-connector.js';
import speciesSeeder from './speciesSeeder.js'
connection();
// call seeder here
await userSeeder();
await speciesSeeder();
//await mongoose.connection.close();
//process.exit();
