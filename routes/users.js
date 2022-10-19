import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import auth from '../helpers/auth.js';
import config from '../config.js';

const router = express.Router();

// Retrieves all users
router.get('/', auth.authenticate, async (req, res, next) => {
  try {
    const users = await User.find().sort('name');
    req.body = setBody({ message: 'Users retrieved', users });
    next();
  } catch (error) {
    return next(error);
  }
});

// Retrieves a specif user
router.get('/:id', auth.authenticate, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    req.body = setBody({ message: 'User retrieved', user });
    next();
  } catch (error) {
    return next(error);
  }
});

// Create a new user
router.post('/', auth.authenticate, async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, config.costFactor);
    const user = new User(req.body);
    const savedUser = await user.save();
    req.body = setBody({ message: 'User created', user: savedUser });
    next();
  } catch (error) {
    return next(error);
  }
});

// Modify existing user
router.patch('/:id', auth.authenticate, async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, config.costFactor);
    }
    const params = req.body;
    const id = req.params.id;
    await User.findByIdAndUpdate(id, params);
    const modifiedUser = await User.findOne({ _id: id });
    req.body = setBody({ message: 'User modified', user: modifiedUser });
    next();
  } catch (error) {
    return next(error);
  }
});

// Delete an existing user
router.delete('/:id', auth.authenticate, async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    req.body = setBody({ message: 'User deleted' });
    next();
  } catch (error) {
    return next(err);
  }
});

// Delete all users (for testing purpose)
router.delete('/', auth.authenticate, async (req, res, next) => {
  try {
    await User.deleteMany({});
    req.body = setBody({ message: 'All users deleted' });
    next();
  } catch (error) {
    return next(error);
  }
});

router.use((req, res, next) => {
  const body = { ...req.body };
  res.send(body);
});

function setBody(payload) {
  let modifiedBody = {};
  modifiedBody = { ...payload };
  return modifiedBody;
}

export default router;
