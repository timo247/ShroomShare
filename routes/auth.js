import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import useAuth from '../helpers/useAuth.js';
import msg from '../data/messages.js';

const router = express.Router();

// authenticate user
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) errorsManager.send(res, msg.ERROR_AUTH_LOGIN);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) useAuth.send(res, msg.ERROR_AUTH_LOGIN);
    req.body = {};
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const userId = req.body.user.id.toString();
  const token = useAuth.generateJwtToken(userId, req.body.admin);
  if (token?.error) next(token.error);
  const verified = useAuth.verifyJwtToken(token.token);
  if (verified?.error) next(verified.error);
  useAuth.send(res, msg.SUCCES_TOKEN_CREATION, { token: token.token });
});

export default router;
