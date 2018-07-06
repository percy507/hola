module.exports = {
  'get-recent-chat-info': getRecentContactsInfo
};

const CategoryModel = require('../../models/category');
const GroupModel = require('../../models/group');
const UserModel = require('../../models/user');

async function getRecentContactsInfo({
  uid,
  recentChatIdArr
}, callback) {
  let resultArr = [];
  let len = recentChatIdArr.length;

  for (let i = 0; i < len; i++) {
    let el = recentChatIdArr[i];
    let obj = {};
    let _uid = el.uid;
    let _gid = el.gid;

    if (_uid) {
      let data = await UserModel.where({
          uid: _uid
        })
        .select({
          uid: 1,
          avatar: 1,
          nickname: 1
        })
        .lean()
        .exec();

      obj = data[0];
      obj.alias = await CategoryModel.getFriendAliasFromCategory({
        uid,
        friendUid: _uid
      });

      obj.lastMessage = 'TODO the last message';
    }

    if (_gid) {
      let data = await GroupModel.where({
          gid: _gid
        })
        .select({
          gid: 1,
          avatar: 1,
          nickname: 1,
          status: 1
        })
        .lean()
        .exec();

      obj = data[0];
      obj.lastMessage = 'TODO the last message';
    }

    resultArr.push(obj);
  }

  callback({
    code: 0,
    data: resultArr,
    message: ''
  });
}
