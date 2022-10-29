import Specy from '../schemas/species.js';


const numberOfSpecies = 10;
const startIndex = 1;

async function seeder(i = startIndex) {
    const specy = await Specy.find({ name: `specy${i}` });

    if (specy.length === 0) await createSpecy(i);
    if (i < numberOfSpecies) seeder(i + 1);
}

async function createSpecy(i) {
    let usage = 'psychadelic'
    if (i % 2 === 0) {
        usage = "edible"
    }
    const specy = new Specy({
        name: `specy${i}`,
        description: `description${i}`,
        usage: usage,
        pictureFile: `pictureFile${i}`,
    });

    try {
        await specy.save();
        return specy
    } catch {
        console.log("specy could not be saved")
    }

}

export default seeder;
