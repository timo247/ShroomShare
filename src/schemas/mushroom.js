import mongoose from 'mongoose';

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
mushroomSchema.index({ 'geolocalisation.location': '2dsphere' });

function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}

mongoose.model('Mushroom', mushroomSchema, 'Mushrooms');
const Mushroom = mongoose.model('Mushroom');

export default Mushroom;
