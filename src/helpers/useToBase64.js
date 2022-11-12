import fs from 'fs';
import path from 'path';

export default function tobase64(relativepath, extension) {
  const basePath = path.resolve(relativepath);
  const imagebase64 = fs.readFileSync(basePath, 'base64');
  const imagebase64andinfos = `data:image/${extension};base64,${imagebase64}`;
  return imagebase64andinfos;
}
