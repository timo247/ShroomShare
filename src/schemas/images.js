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

imageSchema.set('toJSON', {
  transform: transformJsonUser,
});

function transformJsonUser(doc, json, options) {
  json.id = json['_id']; // eslint-disable-line
  delete json['_id']; // eslint-disable-line
  delete json['__v']; // eslint-disable-line
  return json;
}

mongoose.model('Image', imageSchema, 'images');
const Image = mongoose.model('Image');

export default Image;
