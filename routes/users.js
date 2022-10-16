import express from 'express';
import User from '../schemas/user.js';
// import connection from '../database-connector.js';

const router = express.Router();

// Retrieves all users
router.get('/', async (req, res, next) => {
  const user = await User.find({ username: 'user1' });
  res.send(`users: ${user}`);
  // User.find().sort('name').exec((err, users) => {
  //   if (err) return next(err);
  //   res.send(users);
  // });
});

// Retrieves a specif user
router.get('/:id', (req, res, next) => {
  res.send('Got a response from the users route');
});

// Create a new user
router.post('/', (req, res, next) => {
  res.send('Got a response from the users route');
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
