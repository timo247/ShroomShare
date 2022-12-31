import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import useAuth from '../helpers/useAuth.js';
import msg from '../data/messages.js';
import config from '../../config.js';

const debug = config.debug.apiErrors;

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     tags:
 *        - Authentification
 *     summary: Create a JWT token.
 *     requestBody:
 *       $ref: '#/components/requestBodies/CredentialBody'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             examples:
 *               CredentialResponseExemple:
 *                 $ref: '#components/examples/CredentialOkExample'
 */

router.post('/', async (req, res, next) => {
  if (!req.body?.password) return useAuth.send(res, msg.ERROR_FIELD_REQUIRED('password'));
  if (!req.body?.username) return useAuth.send(res, msg.ERROR_FIELD_REQUIRED('username'));
  try {
    const user = await User.findOne().where('username').equals(req.body.username);
    if (!user) useAuth.send(res, msg.ERROR_AUTH_LOGIN);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) useAuth.send(res, msg.ERROR_AUTH_LOGIN);
    req.body = {};
    req.body.user = user;
    next();
  } catch (error) {
    debug(error);
    next(error);
  }
});

router.use((req, res, next) => {
  if (!req.body.user) return useAuth.send(res, msg.ERROR_METHOD_EXISTENCE);
  const userId = req.body.user.id.toString();
  const tokenWrapper = useAuth.generateJwtToken(userId, req.body.user.admin);
  if (tokenWrapper?.error) useAuth.send(res, msg.INTERNALERROR_TOKEN_CREATION);
  const payloadWrapper = useAuth.verifyJwtToken(tokenWrapper.token);
  if (payloadWrapper?.error) return useAuth.send(res, msg.INTERNALERROR_TOKEN_VALIDATION);
  return useAuth.send(
    res,
    msg.SUCCESS_TOKEN_CREATION,
    { user: req.body.user, token: tokenWrapper.token },
  );
});

export default router;
