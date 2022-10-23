
import fs from 'fs'

export function base64_encode(file){
    let bitmap = fs.readFileSync(file);

    return Buffer.from(bitmap).toString('base64');
}

export function base64_decode(file){
    
}
