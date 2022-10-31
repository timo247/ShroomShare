import Specy from '../schemas/species.js';


const numberOfSpecies = 10;
const startIndex = 1;

async function seeder(i = startIndex) {
    const specy = await Specy.find({ name: `specy${i}` });
    if (specy.length === 0) await createSpecy(i);
    if (i < numberOfSpecies) await seeder(i + 1);
}

async function createSpecy(i) {
    let usage = 'commestible'
    if (i % 2 === 0) {
        usage = "non commestible"
    }
    const specy = new Specy({
        name: `specy${i}`,
        description: `description${i}`,
        usage: usage,
        pictureFile: `pictureFile${i}`,
    });

    try {
        await specy.save();
    } catch {
        console.log("specy could not be saved")
    }
    return specy
}

export default seeder;
