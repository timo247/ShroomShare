import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from './schemas/user.js';
import msg from "./data/messages.js";

// When connecting to chat, the user has to choose a language channel.
// Channel are selected by providing a query parameter named 'language'.
// The following values are accepted: 'en', 'fr', 'de', 'it'.
// If omited 'en' is the default value.

const errorsLogger = config.debug.apiErrors;
const CHANNELS = {
  EN: 0,
  FR: 1,
  DE: 2,
  IT: 3,
};
const defaultLangugage = 'en';
const UNAUTHORIZED = 'HTTP/1.1 401 Unauthorized';
const channels = {};
Object.values(CHANNELS).forEach((value) => {
  channels[value] = new Map();
});

function createWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ clientTracking: false, noServer: true });

  wss.on('connection', async (ws, request, client, socket) => {
    const language = getQueryParam('language', request.url) || defaultLangugage;
    const currentChannel = CHANNELS[language.toUpperCase()]
      || CHANNELS[defaultLangugage.toUpperCase()];
    let user;
    try {
      user = await User.findOne({ _id: client.sub });
      if (!user) {
        errorsLogger('id does no more exist');
        return destroySocket(socket, UNAUTHORIZED);
      }
    } catch (error) {
      errorsLogger('id does no more exist');
      return destroySocket(socket, UNAUTHORIZED);
    }
    channels[currentChannel].set(client.sub, { ws, user });
    let response = setUserResponse(msg.CHAT_USER_CONNECTION, user);
    broadcastMessage(response, currentChannel);

    ws.on('message', (message) => {
      const rawMessage = String(message);
      onMessageReceived(ws, rawMessage, user, currentChannel);
    });

    ws.on('close', () => {
      response = setUserResponse(msg.CHAT_USER_DISCONNECTION, user);
      broadcastMessage(response, currentChannel);
      channels[currentChannel].delete(client.sub);
    });
  });

  httpServer.on('upgrade', function upgrade(request, socket, head) {
    authenticate(request, function next(err, client) {
      if (err || !client) {
        return destroySocket(socket, UNAUTHORIZED);
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request, client, socket);
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

function onMessageReceived(ws, message, user, channelId) {
  const response = setUserResponse(msg.CHAT_MESSAGE_RECEPTION, user, message);
  broadcastMessage(response, channelId);
}

function authenticate(request, next) {
  const authorization = request.headers.authorization;
  if (authorization) {
    try {
      const match = authorization.match(/^Bearer (.+)$/);
      const token = match[1];
      const payload = jwt.verify(token, config.secretKey);
      next(undefined, payload);
    } catch (error) {
      next(error);
    }
  }
}

function destroySocket(socket, status) {
  socket.write(`${status}\r\n\r\n`);
  socket.destroy();
}

function setUserResponse(status, user, message) {
  return message
    ? {
      status, message, timestamp: Date.now(), user,
    }
    : {
      status, timestamp: Date.now(), user,
    };
}

function getQueryParam(key, url) {
  const regexp = new RegExp(`${key}=([^&]*)`);
  const matches = url.match(regexp);
  if (matches !== null) return matches[1];
}

export default createWebSocketServer;
