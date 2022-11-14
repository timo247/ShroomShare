import express from 'express';
import isBase64 from 'is-base64';
import msg, { RESSOURCES as R } from '../data/messages.js';
import Mushroom from '../schemas/mushroom.js';
import Species from '../schemas/species.js';
import auth from '../middlewares/authMiddlewares.js';
import Paginator from '../helpers/Paginator.js';
import useAuth from '../helpers/useAuth.js';
import useRouter from '../helpers/useRouter.js';

const router = express.Router();

//app.use(express.json({limit: '50mb'}));

export default router;

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
      mushrooms = await Mushroom.find().where('date').gt(dateMin).lt(date).sort('date');
    } else {
      mushrooms = await Mushroom.find().where('date').gt(dateMin).lt(date).sort('date').select('-picture');
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
    if (loggedUserId !== req.body.user_id) return useAuth.send(res, msg.ERROR_AUTH_PERMISSION_GRANTATION);
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
