const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema({
  uuid: {
    type: String,
    required: [true, 'message-private uuid is required']
  },
  from: {
    type: String,
    required: [true, 'message-private from is required']
  },
  to: {
    type: String,
    required: [true, 'message-private to is required']
  },
  type: {
    type: String,
    required: [true, 'message-private type is required']
  },
  time: mongoose.Schema.Types.Mixed,
  content: mongoose.Schema.Types.Mixed
});

MessageSchema.statics = {
  async saveMessage(message) {
    let newMessage = new this(message);

    await newMessage.save();
  }
};

module.exports = mongoose.model('Message', MessageSchema);
