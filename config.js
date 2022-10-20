import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: normalizePort(process.env.PORT || '3000'),
  apiName: process.env.API_NAME || 'api',
  secretKey: process.env.SECRET_KEY,
  bcryptCostFactor: 10,
  enableDebugMode: process.env.ENABLE_DEBUG_MODE || false,
  databaseUrl: process.env.DATABASE_URL,
};

if (!config.secretKey) throw new Error('env variable $SECRET_KEY should be configured');
if (!config.databaseUrl) throw new Error('env variable $DATAVBASE_URL should be configured');

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
