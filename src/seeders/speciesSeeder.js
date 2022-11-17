import * as fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import Species from '../schemas/species.js';
import Image from '../schemas/images.js';
import tobase64 from '../helpers/useToBase64.js';
import isBase64 from '../helpers/useValidateBase64.js';

async function getCsvData() {
  const filePath = path.resolve('src/data/species.json');
  const data = fs.readFileSync(filePath);
  const buffer = Buffer.from(data);
  const mushStringified = buffer.toString();
  const mushArray = JSON.parse(mushStringified);
  return mushArray;
}

async function seeder() {
  const imgsPath = path.resolve('src/data/images');
  const imgs = fs.readdirSync(imgsPath);
  let i = 0;
  const speciesArray = await getCsvData();
  for (const species of speciesArray) {
    const pictureId = new mongoose.Types.ObjectId();
    const speciesId = new mongoose.Types.ObjectId();
    await createSpecies(species, speciesId, pictureId);
    await createImg(`src/data/images/${imgs[i]}`, speciesId, pictureId);
    i++;
  }
}

async function createSpecies(speciesFromFile, speciesId, pictureId) {
  const species = new Species({
    _id: speciesId,
    name: speciesFromFile.name,
    description: speciesFromFile.description,
    usage: speciesFromFile.usage,
    picture_id: pictureId,
  });
  try {
    await species.save();
  } catch (err) {
    console.warn('species could not be saved', err);
  }
}

async function createImg(imgPath, speciesId, pictureId) {
  const extension = imgPath.split('.')[1];
  const imgBase64 = tobase64(imgPath, extension);
  if (!isBase64(imgBase64)) throw new Error('picture is not base64');
  const image = new Image({
    _id: pictureId,
    value: imgBase64,
    species_id: speciesId,
    collectionName: 'species',
  });
  try {
    await image.save();
  } catch (err) {
    console.warn('Can\t save image');
  }
}

export default seeder;
