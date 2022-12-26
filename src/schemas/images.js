import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const collectionNames = ['species', 'mushrooms'];

const imageSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  specy: {
    type: Schema.Types.ObjectId,
    ref: 'Specy',
  },
  mushroom: {
    type: Schema.Types.ObjectId,
    ref: 'Mushroom',
  },
  collectionName: {
    type: String,
    required: true,
    enum: collectionNames,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
