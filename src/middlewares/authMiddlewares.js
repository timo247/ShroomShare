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
    const payload = await authenticate(req);
    if (payload.error) return useAuth.send(res, payload.error);
    res.locals.currentUserId = payload.sub;
    res.locals.currentUserRole = payload.scope;
    return next();
  },
  async authenticateAdmin(req, res, next) {
    const payload = await authenticate(req);
    if (payload.error) return useAuth.send(res, payload.error);
    res.locals.currentUserId = payload.sub;
    res.locals.currentUserRole = payload.scope;
    if (payload.scope === roles.admin) return next();
    return useAuth.send(res, msg.ERROR_AUTH_PERMISSION_GRANTATION);
  },
};

async function authenticate(req) {
  const authorization = req.get('Authorization');
  if (!authorization) return { error: msg.ERROR_AUTH_HEADER_PRESENCE };
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) return { error: msg.ERROR_AUTH_BEARERTOKEN_FORMAT };
  const token = match[1];
  try {
    const payload = jwt.verify(token, config.secretKey);
    errorLogger(payload);
    return payload;
  } catch (error) {
    return { error: msg.ERROR_TOKEN_VALIDATION };
  }
}

export default authMiddlewares;
