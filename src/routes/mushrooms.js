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
import validateGeoJsonCoordinates from '../helpers/useValidateGeoJsonCoordinates.js';
import validateDate from '../helpers/useValidateDate.js';
import User from '../schemas/user.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;

/**
 * @swagger
 * /mushrooms:
 *    get:
 *      tags:
 *        - Mushrooms
 *      summary: Retrieved all mushrooms
 *      parameters:
 *        - in: query
 *          name: location
 *          type: integer
 *          description: Coordonnées GPS (nombres)
 *        - in: query
 *          name: speciesId
 *          type: String
 *          description: Choississez l'espèce de champignon
 *        - in: query
 *          name: userId
 *          type: integer
 *          description: Choississez l'ID de l'utilisateur
 *        - in: query
 *          name: showPictures
 *          type: boolean
 *          description: Affichez les images ou non
 *        - in: query
 *          name: total
 *          type: boolean
 *          description: Sommez des champignons par utilisateur
 *        - in: query
 *          name: usage
 *          type: String
 *          description: Comestible ou non-comestible
 *        - in: query
 *          name: from
 *          type: date
 *          description: Choississez la date de début
 *        - in: query
 *          name: to
 *          type: date
 *          description: Choississez la date de fin
 *        - in: query
 *          name: page
 *          type: integer
 *          description: Choississez le numéro de la page à afficher.(pas de page zéro et négative)
 *        - in: query
 *          name: pageSize
 *          type: integer
 *          description: Nombre déléments que vous voulez sur la page.
 *      responses:
 *        200:
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#components/schema/RetrievedMushroomSchema'
 *              examples:
 *                AllUserExample:
 *                   $ref: '#/components/examples/RetrievedMushroomExample'
 */

// Retrieves all mushrooms
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const showPictures = req.query?.showPictures;
    const queryTo = req.query?.to;
    const querySpecyId = req.query?.specyId;
    const queryFrom = req.query?.from;
    const long = req.query?.longitude;
    const lat = req.query?.latitude;
    const queryUserId = req.query?.userId;
    let radius = req.query?.radius;
    let dateMin = 0;
    let dateMax = Date.now();
    let dynamicQuery = Mushroom.find();

    if (long && lat) {
      if (long < -180 || long > 90) return useAuth.send(res, msg.ERROR_LONGITUDE_VALIDATION);
      if (lat < -90 || lat > 90) return useAuth.send(res, msg.ERROR_LATITUDE_VALIDATION);
      if (!radius) radius = 1000;
      if (isNaN(radius)) return useAuth.send(res, msg.ERROR_RADIUS_NAN);//eslint-disable-line
      // const query = await Mushroom.find().where('geolocalisation.location.coordinates').near({
      //   center: [parseFloat(long), parseFloat(lat)],
      //   spherical: true,
      //   maxDistance: 5,
      // });
      dynamicQuery = Mushroom.find({
        'geolocalisation.location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [long, lat],
            },
            $minDistance: 0,
            $maxDistance: radius,
          },
        },
      });
      const query = await dynamicQuery;
      console.log(query.length);
    }

    if (queryTo) {
      if (!validateDate(queryTo)) return useAuth.send(res, msg.ERROR_DATE_FORMAT);
      dateMax = queryTo;
      dynamicQuery = dynamicQuery.where('date').lt(dateMax).sort('date');
    }
    if (queryFrom) {
      if (!validateDate(queryFrom)) return useAuth.send(res, msg.ERROR_DATE_FORMAT);
      dateMin = dateMax - queryFrom;
      dynamicQuery = dynamicQuery.where('date').gt(dateMin).sort('date');
    }
    if (queryUserId) {
      const existingUserId = await User.findOne({ _id: queryUserId });
      if (!existingUserId) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
      dynamicQuery = dynamicQuery.where('user_id').equals(queryUserId);
    }
    if (querySpecyId) {
      const existingUserId = await Specy.findOne({ _id: querySpecyId });
      if (!existingUserId) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
      dynamicQuery = dynamicQuery.where('specy_id').equals(querySpecyId);
    }
    let data = await dynamicQuery;
    const pages = new Paginator({
      numberOfItems: data.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query?.currentPage,
    });
    data = data.slice(pages.firstIndex, pages.lastIndex);
    if (showPictures === 'true') {
      const ids = data.map((mush) => mongoose.Types.ObjectId(mush.picture_id)); //eslint-disable-line
      const mushroomsMap = new Map();
      data.forEach((mush) => {
        mushroomsMap.set(mush.id, mush);
      });
      const pictures = await Image.find({
        _id: { $in: ids },
      });
      pictures.forEach((picture) => {
        const mushWithPic = JSON.parse(JSON.stringify(mushroomsMap.get(picture.mushroom_id.toString()))); //eslint-disable-line
        mushWithPic.picture = picture;
        mushroomsMap.set(picture.mushroom_id.toString(), mushWithPic); //eslint-disable-line
      });
      const mushrooms = Array.from(mushroomsMap.values());

      req.body = useAuth.setBody({
        currentPage: pages.currentPage,
        pageSize: pages.pageSize,
        lastPage: pages.lastPage,
        mushrooms,
      });
      return useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), req.body);
    }
    req.body = useAuth.setBody({
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
      mushrooms: data,
    });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), req.body);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /mushrooms:
 *    post:
 *      tags:
 *        - Mushrooms
 *      summary: Add a new mushroom
 *      requestBody:
 *       $ref: '#/components/requestBodies/CreateMushroomBody'
 *      responses:
 *       201:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schema/CreatedMushroomSchema'
 *           examples:
 *            CreatedMushroomExample:
 *             $ref: '#/components/examples/CreatedMushroomExample'
 */

// Add new mushroom
router.post('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const errorMessages = useRouter.checkForRequiredParams(req, res, ['date', 'description', 'specy_id', 'picture', 'geolocalisation']);
    if (errorMessages) return useAuth.send(res, errorMessages);
    const currentSpecy = await Specy.findOne({ id: req.body.specy_id });
    if (!currentSpecy) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY));
    if (!isBase64(req.body.picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    if (!validateDate(req.body.date)) return useAuth.send(res, msg.ERROR_DATE_FORMAT);
    if (!validateGeoJsonCoordinates(req.body.geolocalisation.location.coordinates)) {
      return useAuth.send(res, msg.ERROR_GEOJSON_FORMAT);
    }

    const pictureId = new mongoose.Types.ObjectId();
    const mushroomId = new mongoose.Types.ObjectId();

    const picture = new Image({
      _id: pictureId,
      value: req.body.picture,
      specy_id: req.body.specy_id,
      collectionName: 'mushrooms',
      user_id: req.currentUserId,
      mushroom_id: mushroomId,
    });
    const mushroom = new Mushroom({
      _id: mushroomId,
      user_id: req.currentUserId,
      specy_id: req.body.specy_id,
      picture_id: pictureId,
      description: req.body.description,
      date: req.body.date,
      geolocalisation: {
        location: {
          type: req.body.geolocalisation.location.type,
          coordinates: req.body.geolocalisation.location.coordinates,
        },
      },
    });
    let savedMushroom = await mushroom.save();
    const savedPicture = await picture.save();
    savedMushroom = JSON.parse(JSON.stringify(savedMushroom));
    savedMushroom.picture = savedPicture;
    req.body = useAuth.setBody({ mushroom: savedMushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /mushrooms/:id:
 *    patch:
 *      tags:
 *        - Mushrooms
 *      summary:  Update a mushroom
 *      requestBody:
 *       $ref: '#/components/requestBodies/UpdateMushroomBody'
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schema/UpdatedMushroomSchema'
 *           examples:
 *            CreatedMushroomExample:
 *             $ref: '#/components/examples/UpdatedMushroomExample'
 */

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
    if (req.body.date) {
      if (!validateDate(req.body.date)) return useAuth.send(res, msg.ERROR_DATE_FORMAT);
    }
    if (req.body.geolocalisation.location.coordinates) {
      if (!validateGeoJsonCoordinates(req.body.geolocalisation.location.coordinates)) {
        return useAuth.send(res, msg.ERROR_GEOJSON_FORMAT);
      }
    }
    const params = req.body;
    if (params.picture) {
      const picture = {
        date: Date.now(),
        value: req.params.picture,
      };
      delete params.picture;
      await Image.findOneAndUpdate({ mushroom_id: id }, picture);
    }
    await Mushroom.findByIdAndUpdate(id, params);
    const modifiedMushroom = await Mushroom.findOne({ _id: id });
    const modifiedPicture = await Image.findOne({ mushroom_id: id });
    const newMushroom = JSON.parse(JSON.stringify(modifiedMushroom));
    newMushroom.picture = modifiedPicture;
    req.body = useAuth.setBody({ mushroom: newMushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_MODIFICATION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /mushrooms/:id:
 *    delete:
 *      tags:
 *        - Mushrooms
 *      summary: Delete a mushroom
 *      responses:
 *       200:
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            $ref: '#/components/schema/DeletedMushroomSchema'
 *           examples:
 *            CreatedMushroomExample:
 *             $ref: '#/components/examples/DeletedMushroomExample'
 */

// delete a mushroom
router.delete('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    }
    const mushroomOwnerId = (await Mushroom.findOne({ _id: id })).user_id;
    if (!mushroomOwnerId) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    const areIdsIdentical = String(req.currentUserId) === String(mushroomOwnerId);
    if (!areIdsIdentical) return useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    await Mushroom.deleteOne({ _id: id });
    await Image.deleteOne({ specy_id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(err);
  }
});

export default router;
