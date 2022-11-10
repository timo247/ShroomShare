import express from 'express';
import * as mongoose from 'mongoose';
import config from '../../config.js';
import Image from '../schemas/images.js';
import msg from '../data/messages.js';

const router = express.Router();
const errorLogger = config.debug.apiErrors;
export default router;

// Retrieves all species
router.post('/', async (req, res, next) => {
  try {
    const ids = req.body.ids;
    const filteredIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const imgs = await Image.find({ _id: { $in: filteredIds } });
    res.send({ message: 'Images successfully retrieved', images: imgs });
  } catch (err) {
    return next(err);
  }
});
