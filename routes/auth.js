import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import useAuth from '../helpers/useAuth.js';
import msg from '../data/messages.js';

const router = express.Router();

/**
 * @api {post} /auth Authenticate user
 * @apiName CreateToken
 * @apiGroup Auth
 * @apiPermission none
 *
 * @apiBody {String} username User's username
 * @apiBody {String} password User's password
 *
 * @apiSuccess {String} message Status message
 * @apiSuccess {String} token User's token
 *
 * @apiUse SUCCESS_TOKEN_CREATION
 */
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne().where('username').equals(req.body.username);
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
  const token = useAuth.generateJwtToken(userId, req.body.admin);
  if (token?.error) useAuth.send(res, msg.INTERNALERROR_TOKEN_CREATION);
  const verified = useAuth.verifyJwtToken(token.token);
  if (verified?.error) useAuth.send(res, msg.INTERNALERROR_TOKEN_VALIDATION);
  useAuth.send(res, msg.SUCCESS_TOKEN_CREATION, { token: token.token });
});

export default router;
