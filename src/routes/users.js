import express from 'express';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import auth from '../middlewares/authMiddlewares.js';
import useAuth from '../helpers/useAuth.js';
import config from '../../config.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Paginator from '../helpers/Paginator.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *    get:
 *      tags:
 *        - Users
 *      summary: Get all users
 *      parameters:
 *        - in: query
 *          name: Numéro de la page
 *          type: integer
 *          description: Choississez le numéro de la page à afficher.(pas de page zéro et négative)
 *        - in: query
 *          name: Nombre d'éléments par page
 *          type: integer
 *          description: Nombre déléments que vous voulez sur la page.
 *      responses:
 *        200:
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#components/schema/UserSchema'
 *              examples:
 *                AllUserExample:
 *                   $ref: '#/components/examples/AllUserExample'
 */

// Retrieves all users
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    let users = await User.find().sort('username');
    const pages = new Paginator({
      numberOfItems: users.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query?.currentPage,
    });
    users = users.slice(pages.getFirstIndex(), pages.getLastIndex());
    req.body = useAuth.setBody({
      users, currentPage: pages.currentPage, pageSize: pages.pageSize, lastPage: pages.lastPage,
    });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USERS), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /users/:id:
 *    get:
 *      tags:
 *        - Users
 *      summary: Get a specif user
 *      responses:
 *        200:
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schema/SpecifUserSchema'
 *              examples:
 *                AllUserExample:
 *                   $ref: '#/components/examples/SpecifUserExample'
 */


// Retrieves a specif user
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    req.body = useAuth.setBody({ user });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USER), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /users:
 *    post:
 *      tags:
 *        - Users
 *      summary: Create a new user
 *      requestBody:
 *        $ref: '#/components/requestBodies/UserBody'
 *      responses:
 *        2001:
 *          content:
 *           application/json:
 *              schema:
 *               type: object
 *               $ref: '#/components/schema/CreatedUserSchema'
 *              examples:
 *               CreatedUserExample:
 *                  $ref: '#/components/examples/CreatedUserExample'
 * 
 */

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    checkForRequiredParams(req, res, ['password', 'username', 'email']);
    req.body.password = await bcrypt.hash(req.body.password, config.bcryptCostFactor);
    const payload = useAuth.getPayloadFromToken(req);
    req.body.admin = payload?.scope === 'admin';
    const user = new User(req.body);
    const savedUser = await user.save();
    const tokenWrapper = useAuth.generateJwtToken(req.currentUserId, req.currentUserRole);
    if (tokenWrapper.token) {
      req.body = useAuth.setBody({ user: savedUser, token: tokenWrapper.token });
      useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.USER), req.body);
    } else {
      req.body = useAuth.setBody({ user: savedUser, warnings: [msg.ERROR_TOKEN_CREATION] });
      useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.USER), req.body);
    }
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /users/:id:
 *    patch:
 *      tags:
 *        - Users
 *      summary: Update a user
 *      requestBody:
 *       $ref: '#/components/requestBodies/UpdateUserBody'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *             schema:
 *              type: object
 *              $ref: '#/components/schema/UpdatedUserSchema'
 *             examples:
 *              UpdatedUserExample:
 *                $ref: '#/components/examples/UpdatedUserExample'
 * 
 */

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
    useAuth.send(res, msg.SUCCESS_RESSOURCE_MODIFICATION(R.USER), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /users/:id:
 *    delete:
 *      tags:
 *        - Users
 *      summary: Delete a user
 *      responses:
 *        200:
 *         content:
 *            application/json:
 *             schema:
 *                type: object
 *                $ref: '#/components/schema/DeletedUserSchema'
 *             examples:
 *                DeletedUserExample:
 *                  $ref: '#/components/examples/DeletedUserExample'
 * 
 */


// Delete an existing user
router.delete('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const areIdsIdentical = String(req.currentUserId) !== String(id);
    if (!areIdsIdentical) useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    await User.deleteOne({ _id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.USER), req.body);
  } catch (error) {
    return next(err);
  }
});

// Delete all users (for testing purpose only)
router.delete('/', auth.authenticateAdmin, async (req, res, next) => {
  try {
    await User.deleteMany({});
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.USERS), req.body);
  } catch (error) {
    return next(error);
  }
});

function checkForRequiredParams(req, res, paramNames) {
  paramNames.forEach((name) => {
    if (typeof req.body?.[name] === 'undefined') useAuth.send(res, msg.ERROR_PARAM_REQUIRED(name));
  });
}

export default router;
