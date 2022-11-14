import Mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../schemas/user.js';
import Species from '../schemas/species.js';
import Mushroom from '../schemas/mushroom.js';
import tobase64 from '../helpers/imgBase64.js';
import seeder from './speciesSeeder.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function getCsvData() {
  const filePath = path.resolve('src/data/species.json');
  const data = fs.readFileSync(filePath);
  const buffer = Buffer.from(data);
  const mushStringified = buffer.toString();
  const mushArray = JSON.parse(mushStringified);
  return mushArray;
}

async function getLocation() {
  const filePath = path.resolve('src/data/SeederLocations.txt');
  const data = fs.readFileSync(filePath, 'utf8');
  const locationArray = data.split(' ');
  return locationArray;
}

async function getUser(name) {
  const user = await User.findOne({ username: name });
  console.log(user);
  return user;
}

async function getSpecies(speciesName) {
  const species = await Species.findOne({ name: speciesName });
  return species;
}

for (let i = 1; i < 10; i++) {
  const x = randomInt(1, 10);
  const y = randomInt(1, 6);
  createmushroom(x, y, i);
}
const location = await getLocation();

async function createmushroom(x, y, i) {
  const generatedId = new Mongoose.Types.ObjectId();
  const specieslist = await getCsvData();
  const user = await getUser(`user0${x}`);
  console.log(x);
  console.log('user', user);
  const species = await getSpecies(specieslist[x + y].name);
  console.log(specieslist[x + y].name);
  const imagePath = `./src/data/images/mushroomSeederImg/${y}.jpg`;
  const coordinates = location[i - 1].split(',');
  const mushroom = new Mushroom({
    _id: generatedId,
    user_id: user.id,
    species_id: species.id,
    picture: tobase64(imagePath),
    description: `J'ai trouvé ce magnifique spécimen ${species.name} en bordure de forêt`,
    date: new Date(),
    geolocalisation: {
      location: {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]],
      },
    },
  });

  try {
    await mushroom.save();
  } catch (err) {
    console.warn('mushroom could not be saved', err);
  }
}
export default seeder;
