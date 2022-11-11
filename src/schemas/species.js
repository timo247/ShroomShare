import mongoose from 'mongoose';
import msg from '../data/messages.js';

const Schema = mongoose.Schema;

const usages = ['commestible', 'non-commestible'];

const specySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  usage: {
    type: String,
    required: true,
    enum: usages,
    message: (props) => msg.ERROR_SCHEMA_USAGE(props, String(usages).replace(',', ', ')),
  },
  pictureId: {
    type: String,
    required: true,
  },
});

specySchema.set('toJSON', {
  transform: transformJsonUser,
});

function transformJsonUser(doc, json, options) {
  json.id = json['_id']; // eslint-disable-line
  delete json['_id']; // eslint-disable-line
  delete json['__v']; // eslint-disable-line
  return json;
}

mongoose.model('Specy', specySchema, 'species');
const Specy = mongoose.model('Specy');

export default Specy;
