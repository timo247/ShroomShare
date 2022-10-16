#!/usr/bin/env node

import http from 'http';
import createDebugger from 'debug';
import app from '../app.js';
import config from '../config.js';

const debug = createDebugger('picnic-advisor:server');

/**
 * Get port from environment and store in Express.
 */
app.set('port', config.port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(config.port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof config.port === 'string' ? `Pipe ${config.port}` : `Port ${config.port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pope ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
