import * as fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import Specy from '../schemas/species.js';
import Image from '../schemas/images.js';
import tobase64 from '../helpers/imgBase64.js';

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
  for (const specy of speciesArray) {
    const pictureId = new mongoose.Types.ObjectId();
    const specyId = new mongoose.Types.ObjectId();
    await createSpecy(specy, specyId, pictureId);
    await createImg(`${imgsPath}/${imgs[i]}`, specyId, pictureId);
    i++;
  }
}

async function createSpecy(specyFromFile, specyId, pictureId) {
  const specy = new Specy({
    _id: specyId,
    name: specyFromFile.name,
    description: specyFromFile.description,
    usage: specyFromFile.usage,
    pictureId,
  });
  try {
    await specy.save();
  } catch (err) {
    console.warn('specy could not be saved', err);
  }
}

async function createImg(imgPath, specyId, pictureId) {
  const extension = imgPath.splite('.')[1];
  const imgBase64 = tobase64(imgPath, extension);
  const image = new Image({
    _id: pictureId,
    value: imgBase64,
    resource_id: specyId,
    collectionName: 'species',
  });
  try {
    await image.save();
  } catch (err) {
    console.warn('Can\t save image');
  }
}

export default seeder;
