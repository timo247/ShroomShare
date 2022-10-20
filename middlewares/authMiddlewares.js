import msg from '../data/messages.js';
import auth from '../helpers/useAuth.js';

const roles = {
  admin: 'admin',
  user: 'user',
};

const authMiddlewares = {
  async authenticateUser(req, res, next) {
    const scope = await authenticate(req, res);
    next();
  },
  async authenticateAdmin(req, res, next) {
    const scope = await authenticate(req, res);
    if (scope === roles.admin) return next();
    res.status(403).send(msg.ERROR_AUTH_PERMISSION);
  },
};

async function authenticate(req, res) {
  const authorization = req.get('Authorization');
  if (!authorization) return res.status(401).send(msg.ERROR_AUTH_HEADER_PRESENCE);
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).send(msg.ERROR_AUTH_BEARERTOKEN_FORMAT);
  const token = match[1];
  try {
    const payload = jwt.verify(token, config.secretKey);
    req.currentUserId = payload.sub;
    req.currentUserRole = payload.scope;
    return payload.scope;
  } catch (error) {
    res.status(401).send(msg.ERROR_TOKEN_VALIDATION);
  }
}
export default authMiddlewares;
