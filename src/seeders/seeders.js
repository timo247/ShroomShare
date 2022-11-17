import mongoose from 'mongoose';
import userSeeder from './usersSeeder.js';
import connection from '../helpers/useDbConnector.js';
import speciesSeeder from './speciesSeeder.js';
import mushroomSeeder from './mushroomSeeder.js';
import Species from '../schemas/species.js';
import User from '../schemas/user.js';
import Image from '../schemas/images.js';
import Mushroom from '../schemas/mushroom.js';

connection();
await Promise.all([
  //User.deleteMany(),
  //Species.deleteMany(),
  //Image.deleteMany(),
  Mushroom.deleteMany(),
]);
// call seeder here
//await userSeeder();
//await speciesSeeder();
await mushroomSeeder();
await mongoose.connection.close();
process.exit();
