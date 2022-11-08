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
    const newSpecy = await createSpecy(specy);
    await createImg(`${imgsPath}/${imgs[i]}`, newSpecy.id);
    i++;
  }
}

async function createSpecy(specyFromFile) {
  const id = new mongoose.Types.ObjectId();
  const specy = new Specy({
    _id: id,
    name: specyFromFile.name,
    description: specyFromFile.description,
    usage: specyFromFile.usage,
    pictureId: id,
  });

  try {
    await specy.save();
    return specy;
  } catch (err) {
    console.warn('specy could not be saved', err);
  }
}

async function createImg(imgPath, resourceId) {
  const imgBase64 = tobase64(imgPath);
  const image = new Image({
    value: imgBase64,
    resource_id: resourceId,
    collectionName: 'species',
  });
  try {
    await image.save();
  } catch (err) {
    console.warn('Can\t save image');
  }
}

export default seeder;
