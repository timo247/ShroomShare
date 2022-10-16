import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import mongoose from 'mongoose';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import config from './config.js';

const app = express();

const url = 'mongodb://localhost:27017/shroomshare';
// Use connect method to connect to the Server
mongoose.connect(url, (err, db) => {
  if (err) {
    console.warn(`Could not connect to database because: ${err.message}`);
  } else {
    console.log('Connected to MongoDB');
    // Do something with "db"...
    db.close();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
