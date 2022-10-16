import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Ignition!');
});

export default router;
