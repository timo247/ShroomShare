import express, { query } from 'express';
import isBase64 from '../helpers/useValidateBase64.js';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Mushroom from '../schemas/mushroom.js';
import Species from '../schemas/species.js';
import auth from '../middlewares/authMiddlewares.js';
import Paginator from '../helpers/Paginator.js';
import useAuth from '../helpers/useAuth.js';
import useRouter from '../helpers/useRouter.js';
import User from '../schemas/user.js';
import Mongoose from 'mongoose';

const router = express.Router();

//app.use(express.json({limit: '50mb'}));

export default router;

// Retrieves all mushrooms
router.get('/', auth.authenticateUser, async (req, res, next) => {
  try {
    console.log(Date.now());
    let criteria;
    let dynamicQuery = Mushroom.find();
    const showPictures = req.query?.showPictures;
    const queryDate = req.query?.date;
    const queryDuration = req.query?.duration;
    const longitude = req.query?.longitude;
    const latitude = req.query?.latitude;
    const queryUserId = req.query?.userId;
    const queryUsage = req.query?.Usage;

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
      if (queryDate > Date.now()) {
        return useAuth.send(res, msg.ERROR_DATE_VALIDATION);
      }
      dateMax = queryDate;
      dynamicQuery = dynamicQuery.where('date').lt(dateMax).sort('date');
    }
    if (queryDuration) {
      if (queryDuration > Date.now()) {
        return useAuth.send(res, msg.ERROR_DURATION_VALIDATION);
      }
      dateMin = dateMax - queryDuration;
      dynamicQuery = dynamicQuery.where('date').gt(dateMin).sort('date');
    }

    if (queryUserId) {
      console.log('oui');
      const existingUserId = await User.findOne({ _id: queryUserId });
      if (existingUserId) {
        dynamicQuery = dynamicQuery.where('user_id').equals(queryUserId);
      }
    }
    if (!showPictures) {
      dynamicQuery = dynamicQuery.select('-picture');
    }

    if (queryUsage) {
      // const aggregate = Species.aggregate([])
    }

    const pages = new Paginator({
      numberOfItems: dynamicQuery.length,
      pageSize: req.query?.pageSize,
      currentPage: req.query.currentPage,
    });

    req.body = useAuth.setBody({
      dynamicQuery,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    });
    res.send(await dynamicQuery).status(200);
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
    console.log(payload);
    const loggedUserId = payload?.sub;
    // if (loggedUserId !== req.body.user_id) return useAuth.send(res, msg.ERROR_AUTH_PERMISSION_GRANTATION);
    const currentSpecies = await Species.find({ name: req.body.speciesId });
    console.log(currentSpecies);
    if (!currentSpecies) {
      //return useAuth.send(res, )
    }
    const location = req.body.geolocalisation.location.coordinates;
    const userId = loggedUserId;
    const picture = req.body.picture;
    const generatedId = new Mongoose.Types.ObjectId();
    if (!isBase64(picture)) return useAuth.send(res, msg.ERROR_IMG_BASE64);
    // const alreadyExisting = await Mushroom.find()
    //   .where('species_id')
    //   .equals(currentSpecies.id)
    //   .where('coordinate')
    //   .equals(location)
    //   .where('user_id')
    //   .equals(userId)
    //   .where('picture')
    //   .equals(picture);
    // if (alreadyExisting) return useAuth.send(res, msg.ERROR_MUSHROOM_DUPLICATE);

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
