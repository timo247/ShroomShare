import mongoose from 'mongoose';

const { Schema } = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  admin: { type: Boolean, default: false },
});
mongoose.model('User', userSchema, 'users');
const UserSchema = mongoose.model('User');

export default UserSchema;
