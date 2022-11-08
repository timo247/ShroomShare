import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: 'species',
  },
  collectionName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

mongoose.model('Image', imageSchema, 'images');
const Image = mongoose.model('Image');

export default Image;
