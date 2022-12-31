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

  let i = 1;
  for (const specy of speciesList) {
    const pictureId = new Mongoose.Types.ObjectId();
    const mushroomId = new Mongoose.Types.ObjectId();
    const userId = (await getUser(`user0${i}`)).id;
    const species = (await getSpecies(specy.name));
    const coordinates = location[i - 1].split(',');
    const imagePath = `./src/data/images/${specy.picture}`;
    await createMushroom(species, coordinates, pictureId, mushroomId, userId);
    await createImg(imagePath, species.id, pictureId, userId, mushroomId);
    i++;
    if (i >= 10) break;
  }
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
    specy: specyId,
    mushroom: mushroomId,
    collectionName: 'mushrooms',
    user: userId,
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
    user: userId,
    specy: species.id,
    picture: pictureId,
    description: `J'ai trouvé ce magnifique spécimen ${species.name} en bordure de forêt`,
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [coordinates[1], coordinates[0]],
    },
  });
  try {
    await mushroom.save();
  } catch (err) {
    console.warn('mushroom could not be saved', err);
  }
}
export default seeder;
