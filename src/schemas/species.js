import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const specySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  usage: { type: String, required: true },
  pictureFile: { type: String, required: true },
});
mongoose.model('Specy', specySchema, 'species');
const Specy = mongoose.model('Specy');
export default Specy;
