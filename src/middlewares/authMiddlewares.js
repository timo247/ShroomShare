import jwt from 'jsonwebtoken';
import msg from '../data/messages.js';
import config from '../../config.js';
import useAuth from '../helpers/useAuth.js';

const errorLogger = config.debug.apiErrors;

const roles = {
  admin: 'admin',
  user: 'user',
};

const authMiddlewares = {
  async authenticateUser(req, res, next) {
    const payload = await authenticate(req, res);
    req.currentUserId = payload.sub;
    req.currentUserRole = payload.scope;
    next();
  },
  async authenticateAdmin(req, res, next) {
    const payload = await authenticate(req, res);
    req.currentUserId = payload.sub;
    req.currentUserRole = payload.scope;
    if (payload.scope === roles.admin) return next();
    useAuth.send(res, msg.ERROR_AUTH_PERMISSION_GRANTATION);
  },
};

async function authenticate(req, res) {
  const authorization = req.get('Authorization');
  errorLogger(authorization);
  if (!authorization) useAuth.send(res, msg.ERROR_AUTH_HEADER_PRESENCE);
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) useAuth.send(res, msg.ERROR_AUTH_BEARERTOKEN_FORMAT);
  const token = match[1];
  try {
    const payload = jwt.verify(token, config.secretKey);
    req.currentUserId = payload.sub;
    req.currentUserRole = payload.scope;
    return payload;
  } catch (error) {
    useAuth.send(res, msg.ERROR_TOKEN_VALIDATION);
  }
}
export default authMiddlewares;
