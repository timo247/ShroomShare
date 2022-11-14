export default function validateGeoJsonCoordinates(value) {
  return Array.isArray(value)
    && value.length >= 2 && value.length <= 3
    && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}
