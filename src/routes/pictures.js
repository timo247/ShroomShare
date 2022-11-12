import express from 'express';
import * as mongoose from 'mongoose';
import config from '../../config.js';
import Image from '../schemas/images.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import useAuth from '../helpers/useAuth.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;

// Retrieves all pictures
router.post('/', async (req, res, next) => {
  try {
    const validIds = [];
    const unvalidIds = [];
    const unknownPicturesId = [];
    const picturesToBeSend = {};
    const ids = req.body.ids;
    const idObjects = ids.map((id) => {
      return { valid: mongoose.Types.ObjectId.isValid(id), id };
    });
    idObjects.forEach((id) => { //eslint-disable-line
      if (id.valid === true) validIds.push(id.id);
      if (id.valid === false) unvalidIds.push(msg.ERROR_PICTURE_ID(id.id));
    });
    let pictures = await Image.find({ _id: { $in: validIds } });
    if (!pictures) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.PICTURES));
    pictures = pictures.forEach((picture) => {
      picturesToBeSend[picture.id] = picture;
    });
    validIds.forEach((id) => {//eslint-disable-line
      if (!picturesToBeSend[id]) return msg.ERROR_PICTURE_EXISTENCE(id);
    });
    if (unvalidIds.length > 0) {
      return useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES),//eslint-disable-line
        { pictures: picturesToBeSend, warnings: [...unvalidIds, ...unknownPicturesId] },
      );
    }
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES), { pictures: picturesToBeSend });
  } catch (err) {
    return next(err);
  }
});

export default router;
