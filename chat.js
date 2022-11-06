import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import config from './config.js';
import User from './src/schemas/user.js';

const errorsLogger = config.debug.apiErrors;
const succesLogger = config.debug.apiSucces;

const clients = new Map();

export function createWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ clientTracking: false, noServer: true });

  wss.on('connection', (ws, request, client) => {
    succesLogger(client);

    clients.set(client.sub, ws);

    ws.on('message', (message) => {
      let parsedMessage;
      try {
        const rawMessage = String(message);
        parsedMessage = JSON.parse(rawMessage);
      } catch (err) {
        return errorsLogger('Invalid JSON message received from client');
      }
      onMessageReceived(ws, String(parsedMessage));
    });

    ws.on('close', () => {
      clients.delete(client.sub);
      succesLogger('WebSocket client disconnected');
    });
  });

  httpServer.on('upgrade', function upgrade(request, socket, head) {
    succesLogger('upgrade');
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

export function broadcastMessage(message) {
  succesLogger(
    `Broadcasting message to all connected clients: ${JSON.stringify(message)}`,
  );
  clients.forEach((client) => { client.send(message); });
}

function onMessageReceived(ws, message) {
  succesLogger(`Received WebSocket message: ${JSON.stringify(message)}`);
  ws.send(message);
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

class Payload {
  constructor({
    sub, exp, scope, iat,
  }) {
    this.sub = sub;
    this.exp = exp;
    this.scope = scope;
    this.iat = iat;
    if (!this.sub) throw new Error('sub property is required');
    if (!this.exp) throw new Error('exp property is required');
    if (!this.scope) throw new Error('scope property is required');
    if (!this.iat) throw new Error('iat property is required');
  }
}
