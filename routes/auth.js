import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import auth from '../helpers/useAuth.js';
import msg from '../data/messages.js';

const router = express.Router();

// authenticate user
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).send({ message: msg.ERROR_AUTH_LOGIN });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).send({ message: msg.ERROR_AUTH_LOGIN });
    req.body = {};
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const userId = req.body.user.id.toString();
  const token = auth.generateJwtToken(userId, req.body.admin);
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
