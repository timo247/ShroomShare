import base64 from '@hexagon/base64';

export default function useValidataeBase64(imgBase64) {
  if (!imgBase64) return false;
  if (!imgBase64.includes(',')) return false;
  const mime = imgBase64.split(',')[0];
  const b64 = imgBase64.split(',')[1];
  const mimeRegex = /^data:image\/[a-z]+;base64/;
  if (!mimeRegex.test(mime)) return false;
  if (!base64.validate(b64)) return false;
  return true;
}
