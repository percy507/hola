module.exports = {
  'get-category-list': getCategoryList
};

const CategoryModel = require('../../models/category');
const GroupModel = require('../../models/group');
const UserModel = require('../../models/user');

async function getCategoryList(uid, callback) {
  let categoryArr = await CategoryModel.getCategoryListByUid(uid);
  let categoryLen = categoryArr.length;

  for (let m = 0; m < categoryLen; m++) {
    let category = categoryArr[m];

    if (category.cid !== 0) {
      // get friends info
      let friendArr = category.friends;
      let friendLen = friendArr.length;

      if (friendArr instanceof Array && friendLen) {
        for (let i = 0; i < friendLen; i++) {
          let friend = friendArr[i];
          let userInfo = await UserModel.findOne({
              uid: friend.uid
            })
            .exec();

          friend.nickname = userInfo.nickname;
          friend.avatar = userInfo.avatar;
          friend.signature = userInfo.signature;
        }
      }
    } else {
      // get group info
      let groupArr = category.groups;
      let groupLen = groupArr.length;

      if (groupArr instanceof Array && groupLen) {
        for (let i = 0; i < groupLen; i++) {
          let group = groupArr[i];
          let groupInfo = await GroupModel.findOne({
              gid: group.gid
            })
            .exec();

          group.nickname = groupInfo.nickname;
          group.avatar = groupInfo.avatar;
        }
      }
    }
  }

  callback(categoryArr);
}
