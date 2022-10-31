import tobase64 from '../helpers/imgBase64.js'
import Image from '../schemas/images.js'
import * as fs from 'fs';
import path from 'path'


async function seeder() {
    const base_path = path.resolve('./src/data/Image')
     //Get all images names from files
     const imgs_array = fs.readdirSync(base_path);

     for(const img_file_name of imgs_array) {
            const path = `${base_path}${img_file_name}`;
            const img_base_64 = tobase64(path);
            const image = new Image ({
                value: img_base_64,
                resource_id: '635fe4940e55106427314233',
                collectionName: 'species',
            })
            try {
                await image.save()
            } catch (err) {
                console.log("impossible image to save")
            }  
     }
}

export default seeder