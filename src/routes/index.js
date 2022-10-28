import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  req.body.message = 'Ingition!';
  res.send(req.body);
});

export default router;
