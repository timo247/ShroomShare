import mongoose from 'mongoose';
import validateGeoJsonCoordinates from '../helpers/useValidateGeoJsonCoordinates.js';

const Schema = mongoose.Schema;

const mushroomSchema = new Schema({
  species_id: { type: Schema.Types.ObjectId, ref: 'species' },
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  picture: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
  geolocalisation: {
    // store geospatial information as GeoJSON object
    location: {
      type: {
        type: String,
        required: true,
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
  },
});

// Create a geospatial index on the location property.
mushroomSchema.index({ location: '2dsphere' });

mongoose.model('Mushroom', mushroomSchema, 'mushrooms');
const Mushroom = mongoose.model('Mushroom');

export default Mushroom;
