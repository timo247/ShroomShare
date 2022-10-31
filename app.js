import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsodc from 'swagger-jsdoc';
import mongoose from 'mongoose';
import createError from 'http-errors';
import logger from 'morgan';
import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';
import authRouter from './src/routes/auth.js';
import speciesRouter from './src/routes/species.js'
import config from './config.js';
import connect from './src/helpers/useDbConnector.js';
import msg from './src/data/messages.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShroomShare',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/${config.apiName}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsodc(options);

await connect();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));
app.use(`/${config.apiName}`, indexRouter);
app.use(`/${config.apiName}/auth`, authRouter);
app.use(`/${config.apiName}/users`, usersRouter);
app.use(`/${config.apiName}/species`, speciesRouter);


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
