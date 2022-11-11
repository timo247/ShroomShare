import dotenv from 'dotenv';
import debug from 'debug';

dotenv.config();

const config = {
  port: normalizePort(process.env.PORT || '3000'),
  apiName: process.env.API_NAME || 'api',
  secretKey: process.env.SECRET_KEY,
  bcryptCostFactor: 10,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  debug: {
    apiErrors: debug('api:errors'),
    apiSucces: debug('api:succes'),
  },
};

config.debug.apiErrors.color = debug.colors[1];
config.debug.apiSucces.color = debug.colors[8];

if (!config.secretKey) throw new Error('env variable $SECRET_KEY should be configured');
if (!config.databaseUrl) throw new Error('env variable $DATABASE_URL should be configured');
if (!config.nodeEnv) throw new Error('env variable $NODE_ENV should be configured');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
export default config;
