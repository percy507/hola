const login = require('./modules/login');
const chat = require('./modules/chat');
const chatMessage = require('./modules/chat-message');
const user = require('./modules/user');
const group = require('./modules/group');
const category = require('./modules/category');
const contacts = require('./modules/contacts');
const store = require('./modules/store');
const webrtc = require('./modules/webrtc');

module.exports = {
  login,
  chat,
  chatMessage,
  user,
  group,
  category,
  contacts,
  store,
  webrtc
};
