import express from 'express';
import Specy from '../schemas/species.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Paginator from '../helpers/Paginator.js';
import useAuth from '../helpers/useAuth.js';
import auth from '../middlewares/authMiddlewares.js';
import useRouter from '../helpers/useRouter.js';
import Image from '../schemas/images.js';

// TODO: --------------------------
// * 'GET /' - add {boolean} queryParam to retrieve picture file
// * 'GET /:id' - add retrieve imageFile
// * 'DELETE /:id' - add deletion of the picture file
// * 'POST /' - add test picture file format
// * 'POST /' - add Pictures
// * 'PATCH /:id' - add Pictures
// * 'PATCH /:id' - add test picture file format
// TODO: --------------------------

const router = express.Router();
export default router;

// Retrieves all species
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    let species = await Specy.find().sort('name');
    const pages = new Paginator({
      numberOfItems: species.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query?.currentPage,
    });
    species = species.slice(pages.firstIndex, pages.lastIndex);
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
    const specy = new Specy(req.body);
    const savedSpecy = await specy.save();
    req.body = useAuth.setBody({ user: savedSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

// Update a specy
router.patch('/:id', auth.authenticateAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
    const params = req.body;
    await Specy.findByIdAndUpdate(id, params);
    const modifiedSpecy = await User.findOne({ _id: id });
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
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.SPECY), req.body);
  } catch (error) {
    return next(err);
  }
});
