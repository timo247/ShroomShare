import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import config from './config.js';
import User from './src/schemas/user.js';
import Payload from './src/helpers/Payload.js';

const errorsLogger = config.debug.apiErrors;
const succesLogger = config.debug.apiSucces;
const CHANNELS = {
  FR: 0,
  EN: 1,
  DE: 2,
  IT: 3,
};
const clients = new Map();

export function createWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ clientTracking: false, noServer: true });

  wss.on('connection', async (ws, request, client) => {
    succesLogger(request.params);
    const user = await User.findById(client.sub);
    clients.set(client.sub, { ws, user });
    let response = setUserResponse('user connected', client.sub);
    broadcastMessage(response);

    ws.on('message', (message) => {
      let rawMessage;
      try {
        rawMessage = JSON.stringify(message);
      } catch (err) {
        return errorsLogger('Invalid message received from client');
      }
      onMessageReceived(ws, rawMessage, client.sub);
    });

    ws.on('close', () => {
      response = setUserResponse('user disconnected', client.sub);
      broadcastMessage(response);
      clients.delete(client.sub);
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

export function broadcastMessage(message) {
  clients.forEach((client) => { client.send(JSON.stringify(message)); });
}

function onMessageReceived(ws, message, clientId) {
  const response = setUserResponse('message received', message, clientId);
  broadcastMessage(response);
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

function getActiveUsers(ids) {
  const data = [];
  ids.forEach((id) => {
    data.push(mongoose.Types.ObjectId(id));
  });
  User.find({
    _id: data,
  }, (err, docs) => {
    console.log(docs);
  });
}
