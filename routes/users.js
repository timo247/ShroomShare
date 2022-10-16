import express from 'express';
import User from '../schemas/user.js';

const router = express.Router();

// Retrieves all users
router.get('/', async (req, res, next) => {
  User.find().sort('name').exec((err, users) => {
    if (err) return next(err);
    res.send(users);
  });
});

// Retrieves a specif user
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.find({ _id: id }).exec((err, users) => {
    if (err) return next(err);
    res.send(users);
  });
});

// Create a new user
router.post('/', (req, res, next) => {
  const user = new User(req.body);
  user.save((err, savedUser) => {
    if (err) {
      return next(err);
    }
    res.send(savedUser);
  });
});

// Modify existing user
router.patch('/:id', (req, res, next) => {
  res.send('Got a response from the users route');
});

// Delete an existing user
router.delete('/:id', (req, res, next) => {
  res.send('Got a response from the users route');
});

export default router;
