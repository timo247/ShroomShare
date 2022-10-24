import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import auth from '../middlewares/authMiddlewares.js';
import useAuth from '../helpers/useAuth.js';
import config from '../config.js';
import msg from '../data/messages.js';

const router = express.Router();

// Retrieves all users
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const pageSize = Number(req.query?.pageSize) ?? 5;
    let users = await User.find().sort('username');
    const lastPage = Math.trunc(users.length / pageSize);
    const currentPage = (() => {
      let value = Number(req.query?.currentPage) ?? 1;
      if (typeof value !== 'number') value = 1;
      if (value < 1) value = 1;
      if (value > lastPage) value = lastPage;
      return value;
    })();
    console.log({ pageSize, lastPage, currentPage });
    const firstIndex = (currentPage - 1) * pageSize;
    const lastIndex = firstIndex + pageSize;
    users = users.slice(firstIndex, lastIndex);
    req.body = useAuth.setBody({
      users, currentPage, pageSize, lastPage, firstIndex, lastIndex,
    });
    useAuth.send(res, msg.SUCCESS_USERS_RETRIEVAL, req.body);
  } catch (error) {
    return next(error);
  }
});

// Retrieves a specif user
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    req.body = useAuth.setBody({ user });
    useAuth.send(res, msg.SUCCESS_USER_RETRIEVAL, req.body);
  } catch (error) {
    return next(error);
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, config.bcryptCostFactor);
    const payload = useAuth.getPayloadFromToken(req);
    req.body.admin = payload?.scope === 'admin';
    const user = new User(req.body);
    const savedUser = await user.save();
    const tokenWrapper = useAuth.generateJwtToken(req.currentUserId, req.currentUserRole);
    if (tokenWrapper.token) {
      req.body = useAuth.setBody({ user: savedUser, token: tokenWrapper.token });
      useAuth.send(res, msg.SUCCESS_USER_CREATION, req.body);
    } else {
      req.body = useAuth.setBody({ user: savedUser, warnings: [msg.ERROR_TOKEN_CREATION] });
      useAuth.send(res, msg.SUCCESS_USER_CREATION, req.body);
    }
  } catch (error) {
    return next(error);
  }
});

// Modify existing user
router.patch('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, config.costFactor);
    }
    const params = req.body;
    const id = req.params.id;
    const areIdsIdentical = String(req.currentUserId) !== String(id);
    if (!areIdsIdentical) useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    await User.findByIdAndUpdate(id, params);
    const modifiedUser = await User.findOne({ _id: id });
    req.body = useAuth.setBody({ user: modifiedUser });
    useAuth.send(res, msg.SUCCESS_USER_MODIFICATION, req.body);
  } catch (error) {
    return next(error);
  }
});

// Delete an existing user
router.delete('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const areIdsIdentical = String(req.currentUserId) !== String(id);
    if (!areIdsIdentical) useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    await User.deleteOne({ _id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_USER_DELETION, req.body);
  } catch (error) {
    return next(err);
  }
});

// Delete all users (for testing purpose only)
router.delete('/', auth.authenticateAdmin, async (req, res, next) => {
  try {
    await User.deleteMany({});
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_USERS_DELETION, req.body);
  } catch (error) {
    return next(error);
  }
});

export default router;
