import jwt from 'jsonwebtoken';
import config from '../config.js';

const roles = {
  admin: 'admin',
  user: 'user',
};

const useAuth = {
  generateJwtToken(userId, isAdmin, numberOfDay = 1) {
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
    res.status(message.status).send({ message: message.msg, ...payload });
  },
  setBody(payload) {
    let modifiedBody = {};
    modifiedBody = { ...payload };
    return modifiedBody;
  },
};

export default useAuth;
