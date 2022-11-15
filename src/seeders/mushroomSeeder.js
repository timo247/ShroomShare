import Mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../schemas/user.js';
import Species from '../schemas/species.js';
import Mushroom from '../schemas/mushroom.js';
import tobase64 from '../helpers/useToBase64.js';
import isBase64 from '../helpers/useValidateBase64.js';
import Image from '../schemas/images.js';

let location;
let speciesList;

async function seeder() {
  location = await getLocation();
  speciesList = await getCsvData();
  const max = [];
  for (let index = 1; index < 10; index++) {
    max.push(index);
  }
  for (const i of max) {
    const pictureId = new Mongoose.Types.ObjectId();
    const mushroomId = new Mongoose.Types.ObjectId();
    const y = randomInt(1, 6);
    const userId = (await getUser(`user0${i}`)).id;
    const species = (await getSpecies(speciesList[i + y].name));
    const coordinates = location[i - 1].split(',');
    const imagePath = `./src/data/images/mushroomSeederImg/${y}.jpg`;
    await createMushroom(species, coordinates, pictureId, mushroomId, userId);
    await createImg(imagePath, species.id, pictureId, userId, mushroomId);
  }
}

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
  if (!user) throw new Error('user not found');
  return user;
}

async function getSpecies(speciesName) {
  const species = await Species.findOne({ name: speciesName });
  return species;
}

async function createImg(imgPath, specyId, pictureId, userId, mushroomId) {
  const extension = imgPath.split('.')[1];
  const imgBase64 = tobase64(imgPath, extension);
  if (!isBase64(imgBase64)) throw new Error('picture is not base64');
  const image = new Image({
    _id: pictureId,
    value: imgBase64,
    specy_id: specyId,
    mushroom_id: mushroomId,
    collectionName: 'mushrooms',
    user_id: userId,
  });
  try {
    await image.save();
  } catch (err) {
    console.warn('Can\t save image');
  }
}

async function createMushroom(species, coordinates, pictureId, mushroomId, userId) {
  const mushroom = new Mushroom({
    _id: mushroomId,
    user_id: userId,
    species_id: species.id,
    picture_id: pictureId,
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
