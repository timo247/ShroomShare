import express from 'express';
import isBase64 from 'is-base64';
import mongoose from 'mongoose';
import Specy from '../schemas/species.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Paginator from '../helpers/Paginator.js';
import useAuth from '../helpers/useAuth.js';
import auth from '../middlewares/authMiddlewares.js';
import useRouter from '../helpers/useRouter.js';
import Image from '../schemas/images.js';
import config from '../../config.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;
export default router;

// Retrieves all species
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const showPictures = req.query?.showPictures;
    let species = await Specy.find().sort('name');
    const pages = new Paginator({
      numberOfItems: species.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query?.currentPage,
    });
    species = species.slice(pages.firstIndex, pages.lastIndex);
    if (showPictures === 'true') {
      const ids = species.map((specy) => mongoose.Types.ObjectId(specy.pictureId)); //eslint-disable-line
      const speciesMap = new Map();
      species.forEach((specy) => {
        speciesMap.set(specy['id'].toString(), specy);//eslint-disable-line
      });
      const pictures = await Image.find({
        _id: ids,
      });
      if (!pictures) {
        req.body = useAuth.setBody({
          species,
          currentPage: pages.currentPage,
          pageSize: pages.pageSize,
          lastPage: pages.lastPage,
        });
        return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.PICTURE), req.body);
      }
      pictures.forEach((picture) => {
        const specyWithPicture = JSON.parse(JSON.stringify(speciesMap.get(picture.resource_id.toString())));//eslint-disable-line
        specyWithPicture.picture = picture;
        speciesMap.set(picture.resource_id.toString(), specyWithPicture);//eslint-disable-line
      });
      species = Array.from(speciesMap.values());
    }
    req.body = useAuth.setBody({
      species,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECIES), req.body);
  } catch (error) {
    return next(error);
  }
});

// Retrieve specific specy
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
    const specy = await Specy.findOne({ _id: id });
    if (!specy) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
    }
    const picture = await Image.findOne({ _id: specy.pictureId });
    if (!picture) {
      req.body = useAuth.setBody({ specy });
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.PICTURE), req.body);
    }
    req.body = useAuth.setBody({ specy, picture });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

// Add a new specy
router.post('/', auth.authenticateAdmin, async (req, res, next) => {
  try {
    useRouter.checkForRequiredParams(req, res, ['name', 'description', 'usage', 'pictureFile']);
    const payload = useAuth.getPayloadFromToken(req);
    req.body.admin = payload?.scope === 'admin';
    const alreadyExistingName = await Specy.findOne({ name: req.body.name });
    if (alreadyExistingName) return useAuth.send(res, msg.ERROR_RESSOURCE_UNICITY('name'));
    if (!isBase64(req.params.pictureFile)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    const pictureId = new mongoose.Types.ObjectId();
    const specyId = new mongoose.Types.ObjectId();
    req.body['_id'] = specyId; //eslint-disable-line
    req.body.pictureId = pictureId;
    const picture = req.body.pictureFile;
    delete req.body.pictureFile;
    const specy = new Specy(req.body);
    const newPicture = new Image({ _id: pictureId, value: picture, resource_id: specyId });
    const savedSpecy = await specy.save();
    savedSpecy.picture = newPicture;
    req.body = useAuth.setBody({ specy: savedSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

// Update a specy
router.patch('/:id', auth.authenticateAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    let body;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
    if (req.params.pictureFile ? !isBase64(req.params.pictureFile) : true === false) {
      return useAuth.send(res, msg.ERROR_IMG_BASE64);
    }
    const params = req.body;
    if (req.params.pictureFile) {
      const picture = {
        date: Date.now(),
        value: req.params.pictureFile,
      };
      await Image.findOneAndUpdate({ resource_id: id }, picture);
    }
    await Specy.findByIdAndUpdate(id, params);
    const modifiedSpecy = await User.findOne({ _id: id });
    const modifiedPicture = await Image.findOne({ resource_id: id });
    modifiedSpecy.picture = modifiedPicture;
    req.body = useAuth.setBody({ specy: modifiedSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_MODIFICATION(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

// Delete a specy
router.delete('/:id', auth.authenticateAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
    const areIdsIdentical = String(req.currentUserId) === String(id);
    if (!areIdsIdentical) return useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    const specyToDelete = await User.findOne({ _id: id });
    if (!specyToDelete) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
    await Specy.deleteOne({ _id: id });
    await Image.deleteOne({ resource_id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.SPECY), req.body);
  } catch (error) {
    return next(err);
  }
});
