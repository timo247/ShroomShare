import express from 'express';
import mongoose from 'mongoose';
import isBase64 from '../helpers/useValidateBase64.js';
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

/**
 * @swagger
 * /species:
 *    get:
 *      tags:
 *        - Species
 *      summary: Retrieve all species
 *      parameters:
 *        - in: query
 *          name: page
 *          type: integer
 *          description: Numéro de la page à afficher.(pas de page zéro et négative)
 *        - in: query
 *          name: pageSize
 *          type: integer
 *          description: Nombre d'éléments que vous voulez sur la page.
 *        - in: query
 *          name: showPictures
 *          type: boolean
 *          description: Si vous voulez voir les images ou non.
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#components/schema/RetrievedAllSpecieSchema'
 *           examples:
 *            CreatedSpecieExample:
 *              $ref: '#/components/examples/RetrievedAllSpecieExample'
 */

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
        speciesMap.set(specy['id'].toString(), specy); //eslint-disable-line
      });
      const pictures = await Image.find({
        _id: { $in: ids },
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
        const specyWithPicture = JSON.parse(JSON.stringify(speciesMap.get(picture.resource_id.toString()))); //eslint-disable-line
        specyWithPicture.picture = picture;
        speciesMap.set(picture.resource_id.toString(), specyWithPicture); //eslint-disable-line
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

/**
 * @swagger
 * /species/:id:
 *    get:
 *      tags:
 *        - Species
 *      summary: Retrieve specie
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#components/schema/RetrievedSpecieSchema'
 *           examples:
 *            CreatedSpecieExample:
 *              $ref: '#/components/examples/RetrievedSpecieExample'
 */

// Retrieve specific specy
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
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
    const modifiableSpecy = JSON.parse(JSON.stringify(specy));
    modifiableSpecy.picture = picture;
    req.body = useAuth.setBody({ specy: modifiableSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /species:
 *    post:
 *      tags:
 *        - Species
 *      summary: Create a new specie
 *      requestBody:
 *       $ref: '#/components/requestBodies/SpecieBody'
 *      responses:
 *       201:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#components/schema/CreatedSpecieSchema'
 *           examples:
 *            CreatedSpecieExample:
 *              $ref: '#/components/examples/CreatedSpecieExample'
 */

// Add a new specy
router.post('/', auth.authenticateAdmin, async (req, res, next) => {
  try {
    useRouter.checkForRequiredParams(req, res, ['name', 'description', 'usage', 'picture']);
    const alreadyExistingName = await Specy.findOne({ name: req.body.name });
    if (alreadyExistingName) return useAuth.send(res, msg.ERROR_RESSOURCE_UNICITY('name'));
    if (!isBase64(req.body.picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    const pictureId = new mongoose.Types.ObjectId();
    const specyId = new mongoose.Types.ObjectId();
    req.body['_id'] = specyId; //eslint-disable-line
    req.body.pictureId = pictureId;
    const picture = req.body.picture;
    delete req.body.picture;
    const specy = new Specy(req.body);
    const newPicture = new Image({
      _id: pictureId,
      value: picture,
      resource_id: specyId,
    });
    const savedSpecy = await specy.save();
    const newSpecy = JSON.parse(JSON.stringify(savedSpecy));
    newSpecy.picture = newPicture;
    req.body = useAuth.setBody({ specy: newSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /species/:id:
 *    patch:
 *      tags:
 *        - Species
 *      summary: Update a specie
 *      requestBody:
 *       $ref: '#/components/requestBodies/UpdateSpecieBody'
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#components/schema/UpdatedSpecieSchema'
 *           examples:
 *            CreatedSpecieExample:
 *              $ref: '#/components/examples/UpdatedSpecieExample'
 */

// Update a specy
router.patch('/:id', auth.authenticateAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
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
    await Specy.findByIdAndUpdate(id, params);
    const modifiedSpecy = await Specy.findOne({ _id: id });
    const modifiedPicture = await Image.findOne({ resource_id: id });
    const newSpecy = JSON.parse(JSON.stringify(modifiedSpecy));
    newSpecy.picture = modifiedPicture;
    req.body = useAuth.setBody({ specy: newSpecy });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_MODIFICATION(R.SPECY), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /species/:id:
 *    delete:
 *      tags:
 *        - Species
 *      summary: Delete a specie
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#components/schema/DeletedSpecieSchema'
 *           examples:
 *            CreatedSpecieExample:
 *              $ref: '#/components/examples/DeletedSpecieExample'
 */

// Delete a specy
router.delete('/:id', auth.authenticateAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
    }
    const specyToDelete = await Specy.findOne({ _id: id });
    if (!specyToDelete) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
    await Specy.deleteOne({ _id: id });
    await Image.deleteOne({ resource_id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.SPECY), req.body);
  } catch (error) {
    return next(err);
  }
});

export default router;
