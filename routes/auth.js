import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import config from '../config.js';
import auth from '../helpers/auth.js';

const router = express.Router();
const secretKey = config.secretKey;

// authenticate user
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.username });
    if (!user) return res.sendStatus(401);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.sendStatus(401);
    req.body = {};
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const userId = req.body.user.id.toString();
  const token = auth.generateJwtToken(userId, 1);
  if (token?.error) next(token.error);
  const verified = auth.verifyJwtToken(token.token);
  if (verified?.error) next(verified.error);
  const body = {
    message: 'User connected',
    token: token.token,
  };
  res.send(body);
});

export default router;
