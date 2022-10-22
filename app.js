import express from 'express';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import createError from 'http-errors';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import config from './config.js';
import connect from './helpers/useDbConnector.js';
import msg from './data/messages.js';

await connect();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/doc', express.static(path.join(__dirname, 'doc')));
app.use(`/${config.apiName}`, indexRouter);
app.use(`/${config.apiName}/auth`, authRouter);
app.use(`/${config.apiName}/users`, usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  const env = req.app.get('env');
  res.locals.error = env === 'dev' ? err : {};
  // Send the error status
  res.status(err.status || 500);
  const filtredMessage = errorFilter(res, err);
  if (filtredMessage) return res.send({ message: filtredMessage });
  if (env === 'dev') res.send({ message: err.message });
  res.send({ message: msg.INTERNALERROR.msg });
});

function errorFilter(res, err) {
  if (err instanceof mongoose.Error.ValidationError) return err.message;
}

export default app;
