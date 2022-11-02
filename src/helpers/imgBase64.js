import fs from 'fs'

export default function tobase64(path){
    let imagebase64 = fs.readFileSync(path, 'base64');
    console.log(imagebase64);
    return imagebase64
}