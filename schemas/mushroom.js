import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mushroomSchema = new Schema({
  species_id: { type: Schema.Types.ObjectId, ref: 'species' },
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  picture: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
  location: {
    type: Feature,
    geometry: {
      type: Point,
      coordinates: [125.6, 10.1],
    },
  },
});
mongoose.model('Mushroom', mushroomSchema, 'Mushrooms');
const Mushroom = mongoose.model('Mushroom');

export default Mushroom;
