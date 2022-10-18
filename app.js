import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import config from './config.js';
import connect from './database-connector.js';

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
