import fs from 'fs'

export default function tobase64(path){
    let imagebase64 = fs.readFileSync(path, 'base64');
let imagebase64andinfos = "data:image/jpg;base64,"+imagebase64
    return imagebase64andinfos
}