import jwt from 'jsonwebtoken';
import config from '../config.js';

const auth = {
  generateJwtToken(userId, numberOfDay) {
    const expirationDate = Math.floor(Date.now() / 1000) + numberOfDay * 24 * 3600;
    const payload = { sub: userId, exp: expirationDate };
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
  authenticate(req, res, next) {
    const authorization = req.get('Authorization');
    if (!authorization) return res.status(401).send('Authorization header is missing');
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).send('Authorization header is not a bearer token');
    const token = match[1];
    jwt.verify(token, config.secretKey, (err, payload) => {
      if (err) return res.status(401).send('Your token is invalid or has expired');
      req.currentUserId = payload.sub;
      next();
    });
  },
};

export default auth;
