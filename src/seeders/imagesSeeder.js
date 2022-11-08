import * as fs from 'fs';
import path from 'path';
import tobase64 from '../helpers/imgBase64.js';
import Image from '../schemas/images.js';

async function seeder() {
  const basePath = path.resolve('src/data/Image');
  const imgs = fs.readdirSync(basePath);

  for (const imgFileName of imgs) {
    const imgPath = `${basePath}${imgFileName}`;
    const imgBase64 = tobase64(imgPath);
    const image = new Image({
      value: imgBase64,
      resource_id: '635fe4940e55106427314233',
      collectionName: 'species',
    });
    try {
      await image.save();
    } catch (err) {
      console.log('Can\t save image');
    }
  }
}

export default seeder;
