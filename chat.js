import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import config from './config.js';
import User from './src/schemas/user.js';
import Payload from './src/helpers/Payload.js';

const errorsLogger = config.debug.apiErrors;
const succesLogger = config.debug.apiSucces;
const CHANNELS = {
  EN: 0,
  FR: 1,
  DE: 2,
  IT: 3,
};
const channels = {};
Object.values(CHANNELS).forEach((value) => {
  channels[value] = new Map();
});

function createWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ clientTracking: false, noServer: true });

  wss.on('connection', async (ws, request, client) => {
    const language = getQueryParam('language', request.url) || 'en';
    const currentChannel = CHANNELS[language.toUpperCase()];
    let user;
    try {
      user = await User.findById(client.sub);
    } catch (error) {
      return errorsLogger('id does no more exist');
    }
    channels[currentChannel].set(client.sub, { ws, user });
    let response = setUserResponse('user connected', client.sub);
    broadcastMessage(response, currentChannel);

    ws.on('message', (message) => {
      let rawMessage;
      try {
        rawMessage = String(message);
      } catch (err) {
        return errorsLogger('Invalid message received from client');
      }
      onMessageReceived(ws, rawMessage, client.sub, currentChannel);
    });

    ws.on('close', () => {
      response = setUserResponse('user disconnected', client.sub);
      broadcastMessage(response, currentChannel);
      channels[currentChannel].delete(client.sub);
    });
  });

  httpServer.on('upgrade', function upgrade(request, socket, head) {
    authenticate(request, function next(err, client) {
      if (err || !client) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request, client);
      });
    });
  });
}

// ==========================================================================
//  Helpers
// ==========================================================================

function broadcastMessage(message, channelId) {
  channels[channelId].forEach((client) => { client.ws.send(JSON.stringify(message)); });
}

function onMessageReceived(ws, message, clientId, channelId) {
  const response = setUserResponse('message received', message, clientId);
  broadcastMessage(response, channelId);
}

function authenticate(request, next) {
  const authorization = request.headers.authorization;
  if (authorization) {
    try {
      const match = authorization.match(/^Bearer (.+)$/);
      const token = match[1];
      const payload = new Payload(jwt.verify(token, config.secretKey));
      next(undefined, payload);
    } catch (error) {
      next(error);
    }
  }
}

function setUserResponse(status, message, clientId) {
  return clientId
    ? {
      status, message, timestamp: Date.now(), userId: clientId,
    }
    : {
      status, message, timestamp: Date.now(),
    };
}

function getQueryParam(key, url) {
  const regexp = new RegExp(`${key}=([^&]*)`);
  const matches = url.match(regexp);
  if (matches !== null) return matches[1];
}

export default createWebSocketServer;
