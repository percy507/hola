const Store = require('electron-store');
const socketClient = require('socket.io-client');
const path = require('path');

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

global.store = new Store({
  name: 'hola.config',
  encryptionKey: 'hola'
});

global.socket = socketClient('http://localhost:3000', {
  reconnection: true,
});

global.isAllowLogin = false;
