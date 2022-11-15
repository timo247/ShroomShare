import express from 'express';
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

// Retrieves all mushrooms
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    let dynamicQuery = Mushroom.find();
    const showPictures = req.query?.showPictures;
    const queryDate = req.query?.date;
    const queryDuration = req.query?.duration;
    const longitude = req.query?.longitude;
    const latitude = req.query?.latitude;
    const queryUserId = req.query?.userId;
    let dateMin = 0;
    let dateMax = Date.now();
    let radius = req.query?.radius;
    if (longitude) {
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
      dynamicQuery = Mushroom.find({
        'geolocalisation.location': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $minDistance: 0,
            $maxDistance: radius,
          },
        },
      });
    }

    if (queryDate) {
      if (queryDate > Date.now()) return useAuth.send(res, msg.ERROR_DATE_VALIDATION);
      dateMax = queryDate;
      dynamicQuery = dynamicQuery.where('date').lt(dateMax).sort('date');
    }
    if (queryDuration) {
      if (queryDuration > Date.now()) return useAuth.send(res, msg.ERROR_DURATION_VALIDATION);
      dateMin = dateMax - queryDuration;
      dynamicQuery = dynamicQuery.where('date').gt(dateMin).sort('date');
    }
    if (queryUserId) {
      const existingUserId = await User.findOne({ _id: queryUserId });
      if (!existingUserId) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
      dynamicQuery = dynamicQuery.where('user_id').equals(queryUserId);
    }
    if (!showPictures) {
      dynamicQuery = dynamicQuery.select('-picture');
    }
    let data = await dynamicQuery;
    const pages = new Paginator({
      numberOfItems: data.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query?.currentPage,
    });
    data = data.slice(pages.firstIndex, pages.lastIndex);
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

// Add new mushroom
router.post('/', auth.authenticateUser, async (req, res, next) => {
  try {
    const payload = useAuth.getPayloadFromToken(req);
    const loggedUserId = payload?.sub;
    const currentSpecies = await Species.find({ name: req.body.speciesId });
    if (!currentSpecies) {
      // return useAuth.send(res, )
    }
    const picture = req.body.picture;
    const generatedId = new Mongoose.Types.ObjectId();
    if (!isBase64(picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);

    const mushroom = new Mushroom({
      _id: generatedId,
      user_id: loggedUserId,
      species_id: currentSpecies.id,
      picture: req.body.picture,
      description: req.body.description,
      date: req.body.date,
      geolocalisation: {
        location: {
          type: req.body.geolocalisation.location.type,
          coordinates: req.body.geolocalisation.location.coordinates,
        },
      },
    });
    const savedMushroom = await mushroom.save();
    req.body = useAuth.setBody({ mushroom: savedMushroom });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_CREATION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(error);
  }
});

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
    const mushroomOwnerId = (await Mushroom.findOne({ _id: id })).user_id;
    if (!mushroomOwnerId) return useAuth.send(res, msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM));
    const areIdsIdentical = String(req.currentUserId) === String(mushroomOwnerId);
    if (!areIdsIdentical) return useAuth.send(res, msg.ERROR_OWNERRIGHT_GRANTATION);
    await Mushroom.deleteOne({ _id: id });
    await Image.deleteOne({ resource_id: id });
    req.body = useAuth.setBody();
    useAuth.send(res, msg.SUCCESS_RESSOURCE_DELETION(R.MUSHROOM), req.body);
  } catch (error) {
    return next(err);
  }
});

export default router;
