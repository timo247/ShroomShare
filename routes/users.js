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
    const users = await User.find().sort('username');
    req.body = setBody({ message: msg.SUCCES_USERS_RETRIEVAL, users });
    next();
  } catch (error) {
    return next(error);
  }
});

// Retrieves a specif user
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    req.body = setBody({ message: msg.SUCCES_USER_RETRIEVAL, user });
    next();
  } catch (error) {
    return next(error);
  }
});

// Create a new user
// TODO: create a token for each user
router.post('/', async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, config.costFactor);
    const user = new User(req.body);
    const savedUser = await user.save();
    const tokenWrapper = useAuth.generateJwtToken(req.currentUserId, req.currentUserRole);
    if (tokenWrapper.token) {
      req.body = setBody(
        {
          message: msg.SUCCES_USER_CREATION,
          user: savedUser,
          token: tokenWrapper.token,
        },
      );
    } else {
      req.body = setBody(
        {
          message: msg.SUCCES_USER_CREATION,
          user: savedUser,
          warnings: [msg.ERROR_NO_TOKEN_CREATED],
        },
      );
    }
    next();
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
    await User.findByIdAndUpdate(id, params);
    const modifiedUser = await User.findOne({ _id: id });
    req.body = setBody({ message: msg.SUCCES_USER_MODIFICATION, user: modifiedUser });
    next();
  } catch (error) {
    return next(error);
  }
});

// Delete an existing user
router.delete('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    req.body = setBody({ message: msg.SUCCES_USER_DELETION });
    next();
  } catch (error) {
    return next(err);
  }
});

// Delete all users (for testing purpose)
router.delete('/', auth.authenticateAdmin, async (req, res, next) => {
  try {
    await User.deleteMany({});
    req.body = setBody({ message: msg.SUCCES_USERS_DELETION });
    next();
  } catch (error) {
    return next(error);
  }
});

router.use((req, res, next) => {
  const body = { ...req.body };
  res.send(body);
});

function setBody(payload) {
  let modifiedBody = {};
  modifiedBody = { ...payload };
  return modifiedBody;
}

export default router;
