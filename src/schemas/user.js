import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
    },
    message: (props) => `${props.value} is not a valid email!`,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.set('toJSON', {
  transform: transformJsonUser,
});

function transformJsonUser(doc, json, options) {
  json.id = json['_id']; // eslint-disable-line
  delete json.password; // eslint-disable-line
  delete json['_id']; // eslint-disable-line
  delete json['__v']; // eslint-disable-line
  delete json.email; // eslint-disable-line
  return json;
}

mongoose.model('User', userSchema, 'users');
const User = mongoose.model('User');

export default User;
