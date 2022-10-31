import Specy from '../schemas/species.js';
import * as fs from 'fs';


async function getCsvData() {
    const data = fs.readFileSync('C:/Users/timot/OneDrive/Documents/HEIG/semestre-5/ArchiOWeb/Projet/shroom-share/src/data/species.json')
    const buffer = Buffer.from(data)
    const mush_stringified = buffer.toString()
    const mush_array = JSON.parse(mush_stringified)
    return mush_array
}

async function seeder() {
    const species_array = await getCsvData()
     for (const specy of species_array){
        await createSpecy(specy);
    }
}

async function createSpecy(specy_from_file) {
    const specy = new Specy({
        name: specy_from_file.name,
        description: specy_from_file.description,
        usage: specy_from_file.usage,
        pictureFile: 'random',
    });

    try {
        await specy.save();
        return specy
    } catch (err) {
        console.log("specy could not be saved", err)
    }
}

export default seeder;
