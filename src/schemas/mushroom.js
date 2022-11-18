import mongoose from 'mongoose';
import validateGeoJsonCoordinates from '../helpers/useValidateGeoJsonCoordinates.js';

const Schema = mongoose.Schema;

const mushroomSchema = new Schema({
  specy_id: {
    type: Schema.Types.ObjectId,
    ref: 'species',
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  picture_id: {
    type: Schema.Types.ObjectId,
    ref: 'images',
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array',
      },
    },
  },
});

// Create a geospatial index on the location property.
mushroomSchema.index({ location: '2dsphere' });

mushroomSchema.set('toJSON', {
  transform: transformJsonUser,
});

function transformJsonUser(doc, json, options) {
  json.id = json['_id']; // eslint-disable-line
  delete json['_id']; // eslint-disable-line
  delete json['__v']; // eslint-disable-line
  return json;
}

mongoose.model('Mushroom', mushroomSchema, 'mushrooms');
const Mushroom = mongoose.model('Mushroom');

export default Mushroom;
