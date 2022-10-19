import express from 'express';
import User from '../schemas/user.js';
import auth from '../helpers/auth.js';

const router = express.Router();

// Retrieves all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort('name');
    req.body = {};
    req.body.message = 'Users retrieved';
    req.body.users = users;
    next();
  } catch (error) {
    return next(error);
  }
});

// Retrieves a specif user
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    req.body = {};
    req.body.message = 'User retrieved';
    req.body.user = user;
    next();
  } catch (error) {
    return next(error);
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    req.body = {};
    req.body.message = 'User created';
    req.body.user = savedUser;
    next();
  } catch (error) {
    return next(error);
  }
});

// Modify existing user
router.patch('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const params = req.body;
    await User.findByIdAndUpdate(id, params);
    const modifiedUser = await User.findOne({ _id: id });
    req.body = {};
    req.body.message = 'User modified';
    req.body.user = modifiedUser;
    next();
  } catch (error) {
    return next(error);
  }
});

// Delete an existing user
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    req.body = {};
    req.body.message = 'User deleted';
    next();
  } catch (error) {
    return next(err);
  }
});

// Delete all users (for testing purpose)
router.delete('/', async (req, res, next) => {
  try {
    await User.deleteMany({});
    req.body = {};
    req.body.message = 'All Users deleted';
    next();
  } catch (error) {
    return next(error);
  }
});

router.use((req, res, next) => {
  const body = { ...req.body };
  res.send(body);
});

export default router;
