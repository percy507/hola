module.exports = {
  'get-history-message': getHistoryMessage,
  'message': receiveMessage
};

const MessageModel = require('../../models/message');
const GroupModel = require('../../models/group');

async function getHistoryMessage(query, callback) {
  let isGroup = query.gid ? true : false;
  let resultArr = [];
  let condition;

  if (isGroup) {
    let {
      gid
    } = query;

    condition = {
      to: gid
    };

    resultArr = await MessageModel.where(condition)
      .sort({
        time: 'ascending'
      }) // descending
      .exec();
  } else {
    let {
      uid,
      friendUid
    } = query;

    condition = [{
      from: uid,
      to: friendUid
    }, {
      from: friendUid,
      to: uid
    }];

    resultArr = await MessageModel.where({})
      .or(condition)
      .sort({
        time: 'ascending'
      }) // descending
      .exec();
  }

  // TODO
  // load history messages piece by piece

  callback({
    code: 0,
    data: resultArr,
    message: ''
  });
}

async function receiveMessage(message, callback) {
  const isGroup = message.to.startsWith('g');
  const userHash = global.$userHash;
  const fromSocketId = userHash[message.from];
  const socket = global.$sockets[fromSocketId];

  // set message time only on server
  message.time = Date.now();

  // save message to database
  await MessageModel.saveMessage(message);

  if (isGroup) {
    const gid = message.to;
    const groups = await GroupModel.where({
        gid
      })
      .exec();
    const members = groups[0].members;

    if (members.length > 1) {
      members.forEach(el => {
        const uid = el.uid;

        if (uid !== message.from) {
          const toSocketId = userHash[uid];

          if (toSocketId) {
            socket.to(toSocketId)
              .emit('new-message', message);

            callback({
              code: 0,
              data: {
                uuid: message.uuid,
                time: message.time
              },
              message: `Message has send to ${uid}`
            });
          } else {
            callback({
              code: 0,
              data: null,
              message: 'Current user is offline'
            });
          }
        }
      });
    }
  } else {
    const toSocketId = userHash[message.to];

    if (toSocketId) {
      // dispatch message
      socket.to(toSocketId)
        .emit('new-message', message);

      callback({
        code: 0,
        data: {
          uuid: message.uuid,
          time: message.time
        },
        message: `Message has send to ${message.to}`
      });
    } else {
      callback({
        code: 0,
        data: null,
        message: 'Current user is offline'
      });
    }
  }
}
