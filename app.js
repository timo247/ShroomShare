import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import debug from 'debug';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import config from './config.js';
import connect from './helpers/useDbConnector.js';
import msg from './data/messages.js';

connect();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  debug('api')(`error: ${err.message}`);
  res.status(err.status || 500);
  if (env === 'dev') res.send({ message: err.message });
  res.send({ messge: msg.INTERNALERROR.msg });
});

export default app;
