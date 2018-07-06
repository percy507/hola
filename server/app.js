const Koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const Http = require('http');
const Socket = require('socket.io');
const mongoose = require('mongoose');
const controllers = require('./controllers');
const log = require('./utils/log');

const app = new Koa();
const server = Http.createServer(app.callback());
const dbConnection = mongoose.connection;
const io = Socket(server, {
  origins: '*:*'
});

mongoose.connect('mongodb://localhost:27017/hola', {
  useNewUrlParser: true
});

dbConnection.on('error', (err) => {
  log.error(`${err.name}: ${err.message}`);
});

dbConnection.once('open', () => {
  log.success('Database: connect success');
});

app.keys = ['secret key'];

app.use(koaMount('/upload', koaStatic('./upload')));

global.$userHash = {};
global.$sockets = io.sockets.sockets;

let userHash = global.$userHash;

io.on('connection', function(socket) {
  // bind events and handlers
  Object.keys(controllers)
    .forEach(module => {
      Object.keys(controllers[module])
        .forEach(key => {
          socket.on(key, controllers[module][key]);
        });
    });

  // handle user connect，trigger at login success
  socket.on('user-connect', function(uid) {
    userHash[uid] = socket.id;

    log.success(`\nuser[${uid}] connected`);
    log.success(JSON.stringify(userHash, null, 2));
  });

  // handle user disconnect，trigger at logout success
  socket.on('user-disconnect', function(uid) {
    delete userHash[uid];

    log.success(`\nuser[${uid}] disconnected`);
    log.success(JSON.stringify(userHash, null, 2));
  });

  // handle unexpected disconnect，such as app process been killed
  socket.on('disconnect', function() {
    let uid = '';

    Object.keys(userHash)
      .find(key => {
        if (userHash[key] === socket.id) {
          uid = key;
          return true;
        }
      });

    delete userHash[uid];

    log.success(`\nuser[${uid}] disconnected`);
    log.success(JSON.stringify(userHash, null, 2));
  });
});

// error handling
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx);
});

server.listen(3000);

log.success('\nServer: http://localhost:3000');
