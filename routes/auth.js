import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import useAuth from '../helpers/useAuth.js';
import msg from '../data/messages.js';

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     description: Create a jWT token.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *         content:
 *         application/json:
 *         schema:
 */
router.post('/', async (req, res, next) => {
  if (!req.body?.password ?? undefined) useAuth.send(res, msg.ERROR_AUTH_PASSWORD_REQUIRED);
  if (!req.body?.username ?? undefined) useAuth.send(res, msg.ERROR_AUTH_USERNAME_REQUIRED);
  const user = await User.findOne().where('username').equals(req.body.username);
  try {
    if (!user) useAuth.send(res, msg.ERROR_AUTH_LOGIN);
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
  const tokenWrapper = useAuth.generateJwtToken(userId, req.body.user.admin);
  if (tokenWrapper?.error) useAuth.send(res, msg.INTERNALERROR_TOKEN_CREATION);
  const payloadWrapper = useAuth.verifyJwtToken(tokenWrapper.token);
  if (payloadWrapper?.error) useAuth.send(res, msg.INTERNALERROR_TOKEN_VALIDATION);
  useAuth.send(res, msg.SUCCESS_TOKEN_CREATION, { token: tokenWrapper.token });
});

export default router;
