import express from 'express';
import * as mongoose from 'mongoose';
import config from '../../config.js';
import Image from '../schemas/images.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import useAuth from '../helpers/useAuth.js';
import auth from '../middlewares/authMiddlewares.js';
import useRouter from '../helpers/useRouter.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;

/**
 * @swagger
 * /pictures:
 *    post:
 *      tags:
 *        - Pictures
 *      summary: Retrieve all pictures
 *      requestBody:
 *       $ref: '#/components/requestBodies/RetrievePicturesBody'
 *      responses:
 *       201:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schema/RetrievedPictureSchema'
 *           examples:
 *            CreatedMushroomExample:
 *             $ref: '#/components/examples/RetrievedPictureExample'
 */

// Retrieves all pictures
router.post('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const errorsMessages = useRouter.checkForRequiredParams(req, res, ['ids']);
    if (errorsMessages) return useAuth.send(res, errorsMessages);
    if (req.body.ids.length === 0) return useAuth.send(res, msg.ERROR_EMPTY_ARRAY('ids'));
    const validIds = [];
    const unvalidIds = [];
    const ids = req.body.ids;
    const idObjects = ids.map((id) => {
      return { valid: mongoose.Types.ObjectId.isValid(id), id };
    });
    idObjects.forEach((id) => { //eslint-disable-line
      if (id.valid === true) validIds.push(id.id);
      if (id.valid === false) unvalidIds.push(msg.ERROR_PICTURE_ID(id.id));
    });
    const pictures = await Image.find({ _id: { $in: validIds } });
    const availablePicturesId = pictures.map((picture) => picture.id);
    const unknownPicturesId = validIds.filter((id) => !availablePicturesId.includes(id));
    const unknownPicturesIdMsg = unknownPicturesId.map((id) => msg.ERROR_PICTURE_EXISTENCE(id));
    if (pictures.length === 0) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.PICTURES));
    validIds.forEach((id) => { //eslint-disable-line
      if (!pictures.find((pictureId) => pictureId === id)) return msg.ERROR_PICTURE_EXISTENCE(id);
    });
    if (unvalidIds.length > 0 || unknownPicturesIdMsg.length > 0) {
      return useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES), //eslint-disable-line
        { pictures, warnings: [...unvalidIds, ...unknownPicturesIdMsg] },
      );
    }
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES), { pictures });
  } catch (err) {
    return next(err);
  }
});

export default router;
