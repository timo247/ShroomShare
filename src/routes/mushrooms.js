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
    if (req.body.date) {
      if (!validateDate(req.body.date)) return useAuth.send(res, msg.ERROR_DATE_FORMAT);
    }
    if (req.body.geolocalisation) {
      if (!validateGeoJsonCoordinates(req.body.geolocalisation)) {
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

// Retrieves all mushrooms
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const showPictures = req.query?.showPictures;
    const queryDate = req.query?.date;
    const queryDuration = req.query?.duration;
    const longitude = req.query?.longitude;
    const latitude = req.query?.latitude;
    let dateMin = 0;
    let dateMax = Date.now();
    let radius = req.query?.radius;
    if (longitude) {
      console.log(longitude);
      if (longitude < -180 || longitude > 90) {
        return useAuth.send(res, msg.ERROR_LONGITUDE_VALIDATION);
      }
      if (latitude) {
        if (latitude < -90 || latitude > 90) {
          return useAuth.send(res, msg.ERROR_LATITUDE_VALIDATION);
        }
      }
      if (!radius) {
        radius = 10;
      }
    }
    if (queryDate) {
      if (queryDate > Date.now()) {
        return useAuth.send(res, msg.ERROR_DATE_VALIDATION);
      }
      dateMax = queryDate;
    }
    if (queryDuration) {
      if (queryDuration > Date.now()) {
        return useAuth.send(res, msg.ERROR_DURATION_VALIDATION);
      }
      dateMin = dateMax - queryDuration;
    }
    let mushrooms;
    if (showPictures === 'true') {
      mushrooms = await Mushroom.find()
        .where('date')
        .lt(dateMax)
        .gt(dateMin)
        .where('location')
        .near({ center: [longitude, latitude], maxDistance: radius, spherical: true })
        .sort('date');
    } else {
      mushrooms = await Mushroom.find()
        .where('date')
        .lt(dateMax)
        .gt(dateMin)
        .where('location')
        .near({ center: [longitude, latitude], maxDistance: radius, spherical: true })
        .sort('date')
        .select('-picture');
    }
    const pages = new Paginator({
      numberOfItems: mushrooms.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query.currentPage,
    });
    mushrooms = mushrooms.slice(pages.firstIndex, pages.lastIndex);

    req.body = useAuth.setBody({
      mushrooms,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    });
    res.send(mushrooms).status(200);
  } catch (err) {
    next(err);
  }
});

// Retrieve specific mushroom
router.get('/:id', auth.authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
    const mushroom = await Mushroom.findOne({ _id: id });
    if (!mushroom) {
      return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    }
    req.body = useAuth.setBody({ mushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

// Retrieve by date

router.get('/date/:date/:duration', auth.authenticateUser, async (req, res, next) => {
  try {
    const showPictures = req.query?.showPictures;
    let mushrooms;
    const date = req.params.date;
    const duration = req.params.duration;
    if (date > Date.now()) {
      return useAuth.send(res, msg.ERROR_DATE_VALIDATION);
    }
    if (duration > Date.now()) {
      return useAuth.send(res, msg.ERROR_DURATION_VALIDATION);
    }
    const dateMin = date - duration;
    if (showPictures === 'true') {
      mushrooms = await Mushroom.find().where('date').gt(dateMin).lt(date)
        .sort('date');
    } else {
      mushrooms = await Mushroom.find().where('date').gt(dateMin).lt(date)
        .sort('date')
        .select('-picture');
    }
    const pages = new Paginator({
      numberOfItems: mushrooms.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query.currentPage,
    });
    mushrooms = mushrooms.slice(pages.firstIndex, pages.lastIndex);

    req.body = useAuth.setBody({
      mushrooms,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    });
    res.send(mushrooms).status(200);
  } catch (err) {
    next(err);
  }
});

// Retrieve by location area

router.get('/location/:long/:lat/:radius', auth.authenticateUser, async (req, res, next) => {
  try {
    const showPictures = req.query?.showPictures;
    let mushrooms;
    const longitude = req.params.long;
    if (!longitude) {
      return useAuth.send(res, msg.ERROR_LONGITUDE_REQUIREMENTS);
    }
    if (longitude < -180 || longitude > 90) {
      return useAuth.send(res, msg.ERROR_LONGITUDE_VALIDATION);
    }
    const latitude = req.params.lat;

    if (!latitude) {
      return useAuth.send(res, msg.ERROR_LATITUDE_REQUIREMENTS);
    }
    if (latitude < -90 || latitude > 90) {
      return useAuth.send(res, msg.ERROR_LATITUDE_VALIDATION);
    }
    let radius = req.params.radius;
    if (!radius) {
      radius = 0;
    }

    const coordinateList = await Mushroom.find().select('coordinates', '_id');
    let coordinatesWithinRadius;
    coordinateList.forEach((element) => {
      if (geolib.isPointWithinRadius(element.coordinate, { longitude, latitude }, radius)) {
        IdsWithinRadius = element.id;
      }
    });

    if (showPictures === 'true') {
      mushrooms = await Mushroom.find(IdsWithinRadius).sort('date');
    } else {
      mushrooms = await Mushroom.find().sort('date').select('-picture');
    }
    const pages = new Paginator({
      numberOfItems: mushrooms.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query.currentPage,
    });
    mushrooms = mushrooms.slice(pages.firstIndex, pages.lastIndex);

    req.body = useAuth.setBody({
      mushrooms,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    });
    res.send(mushrooms).status(200);
  } catch (err) {
    next(err);
  }
});

// Add new mushroom
router.post('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const payload = useAuth.getPayloadFromToken(req);
    const loggedUserId = payload?.sub;
    if (loggedUserId !== req.body.user_id) {
      return useAuth.send(res, msg.ERROR_AUTH_PERMISSION_GRANTATION);
    }
    const currentSpecies = await Species.find({ name: req.body.speciesName });
    const location = req.body.coordinate;
    const userId = req.body.userId;
    const picture = req.body.picture;
    if (!isBase64(req.params.picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    const alreadyExisting = await Mushroom.find()
      .where('species_id')
      .equals(currentSpecies.id)
      .where('coordinate')
      .equals(location)
      .where('user_id')
      .equals(userId)
      .where('picture')
      .equals(picture);
    if (alreadyExisting) return useAuth.send(res, msg.alreadyExisting('name'));
    const mushroom = new Mushroom(req.body);
    const savedMushroom = await mushroom.save();
    req.body = useAuth.setBody({ mushroom: savedMushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

export default router;
