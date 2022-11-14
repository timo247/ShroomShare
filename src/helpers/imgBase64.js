import fs from 'fs';
import path from 'path';

export default function tobase64(relativepath) {
  const basePath = path.resolve(relativepath);
  const extension = relativepath.substr(relativepath.length - 3);
  const imagebase64 = fs.readFileSync(basePath, 'base64');
  const imagebase64andinfos = `data:image/${extension}base64, ${imagebase64}`;
  return imagebase64andinfos;
}
