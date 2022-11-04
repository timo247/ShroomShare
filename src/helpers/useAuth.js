import jwt from 'jsonwebtoken';
import config from '../../config.js';

const roles = {
  admin: 'admin',
  user: 'user',
};

const useAuth = {
  generateJwtToken(userId, isAdmin, numberOfDay = 7) {
    const expirationDate = Math.floor(Date.now() / 1000) + numberOfDay * 24 * 3600;
    const role = isAdmin ? roles.admin : roles.user;
    const payload = { sub: userId, exp: expirationDate, scope: role };
    try {
      const token = jwt.sign(payload, config.secretKey);
      return { token };
    } catch (error) {
      return { error };
    }
  },
  verifyJwtToken(token) {
    try {
      const payload = jwt.verify(token, config.secretKey);
      return { payload };
    } catch (error) {
      return { error };
    }
  },
  send(res, message, payload) {
    // res.status(message.status).send({ message: message.msg, ...payload });
    return Array.isArray(message.msg)
      ? res.status(message.status).send({ messages: message.msg, ...payload })
      : res.status(message.status).send({ message: message.msg, ...payload });
  },
  setBody(payload) {
    let modifiedBody = {};
    modifiedBody = { ...payload };
    return modifiedBody;
  },
  getPayloadFromToken(req) {
    const authorization = req.get('Authorization');
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) return {};
    const token = match[1];
    try {
      const payload = jwt.verify(token, config.secretKey);
      return payload;
    } catch (error) {
      return {};
    }
  },
};

export default useAuth;
