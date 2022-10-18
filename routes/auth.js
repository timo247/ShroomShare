import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/user.js';
import config from '../config.js';

const router = express.Router();
const secretKey = config.secretKey;

// authenticate user
router.post('/', async (req, res, next) => {
  try {
    req.body = {};
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.sendStatus(401);
    const match = bcrypt.compare(req.body.password, user.password);
    if (!match) return res.sendStatus(401);
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const userId = req.body.user.id.toString();
  const token = generateJwtToken(userId, 1);
  if (token?.error) next(token.error);
  const verified = verifyJwtToken(token.token);
  if (verified?.error) next(verified.error);
  const body = {
    message: 'User connected',
    token: token.token,
  };
  res.send(body);
});

function generateJwtToken(userId, numberOfDay) {
  const expirationDate = Math.floor(Date.now() / 1000) + numberOfDay * 24 * 3600;
  const payload = { sub: userId, exp: expirationDate };
  try {
    const token = jwt.sign(payload, secretKey);
    return { token };
  } catch (error) {
    return { error };
  }
}

function verifyJwtToken(token) {
  try {
    const payload = jwt.verify(token, secretKey);
    return { payload };
  } catch (error) {
    return { error };
  }
}

export default router;
