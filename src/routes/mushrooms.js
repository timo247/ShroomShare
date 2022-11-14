import express from 'express';
import mongoose from 'mongoose';
import isBase64 from '../helpers/useValidateBase64.js';
import Specy from '../schemas/species.js';
import Mushroom from '../schemas/mushroom.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Paginator from '../helpers/Paginator.js';
import useAuth from '../helpers/useAuth.js';
import auth from '../middlewares/authMiddlewares.js';
import useRouter from '../helpers/useRouter.js';
import Image from '../schemas/images.js';
import config from '../../config.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;

// Update a mushroom
router.patch('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    }
    if (req.body.picture) {
      if (!isBase64(req.body.picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    }
    const params = req.body;
    if (params.picture) {
      const picture = {
        date: Date.now(),
        value: req.params.picture,
      };
      delete params.picture;
      await Image.findOneAndUpdate({ resource_id: id }, picture);
    }
    await Mushroom.findByIdAndUpdate(id, params);
    const modifiedMushroom = await Specy.findOne({ _id: id });
    const modifiedPicture = await Image.findOne({ resource_id: id });
    const newMushroom = JSON.parse(JSON.stringify(modifiedMushroom));
    newMushroom.picture = modifiedPicture;
    req.body = useAuth.setBody({ specy: newMushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_MODIFICATION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

// delete a mushroom
router.delete('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    }
    const mushroomOwnerId = await Mushroom.find({ _id: id }).user_id;
    const pictureOwnerId = await Picture.find({ _id: id }).resource_id;
    const areIdsIdentical1 = String(req.currentUserId) === String(mushroomOwnerId);
    const areIdsIdentical2 = String(req.currentUserId) === String(pictureOwnerId);
    if (!areIdsIdentical1) return useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    if (!areIdsIdentical2) return useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    const mushroomToDelete = await Mushroom.findOne({ _id: id });
    if (!mushroomToDelete) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    await Mushroom.deleteOne({ _id: id });
    await Image.deleteOne({ resource_id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(err);
  }
});

export default router;
