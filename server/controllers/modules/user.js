module.exports = {
  'get-user-info': getUserInfo,
  'update-user-info': updateUserInfo,
  'update-user-avatar': updateUserAvatar,
  'get-friend-info': getFriendInfo,
  'delete-friend': deleteFriend
};

const CategoryModel = require('../../models/category');
const UserModel = require('../../models/user');

async function getUserInfo(uid, callback) {
  let userInfo = await UserModel.getUserInfo(uid);

  callback(userInfo);
}

async function updateUserInfo({
  uid,
  userInfo
}, callback) {
  await UserModel.where({
      uid
    })
    .update({ ...userInfo
    })
    .exec();

  callback({
    code: 0,
    data: '',
    message: '更新成功'
  });
}

async function updateUserAvatar({
  uid,
  base64Data
}, callback) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, `../../upload/avatars`);
  const url = `http://localhost:3000/upload/avatars/${uid}.png?time=${Date.now()}`;

  base64Data = base64Data.replace(/^data:image\/.+?;base64,/, '');

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  fs.writeFileSync(`${filePath}/${uid}.png`, base64Data, 'base64');

  await UserModel.where({
      uid
    })
    .update({
      avatar: url
    })
    .exec();

  callback({
    code: 0,
    data: '',
    message: '更新头像成功'
  });
}

async function getFriendInfo({
  uid,
  friendUid
}, callback) {
  let friendInfo = await UserModel.where({
      uid: friendUid
    })
    .lean()
    .exec();
  let alias = await CategoryModel.getFriendAliasFromCategory({
    uid,
    friendUid
  });

  friendInfo = friendInfo[0];

  if (friendInfo) {
    friendInfo.alias = alias;

    callback(friendInfo);
  }
}

async function deleteFriend({
  uid,
  friendUid
}, callback) {
  let categoryArr = await CategoryModel.getCategoryListByUid(uid);
  let categoryLen = categoryArr.length;

  for (let m = 0; m < categoryLen; m++) {
    let category = categoryArr[m];

    if (category.cid !== 0) {
      let friendArr = category.friends;
      let friendLen = friendArr.length;

      if (friendArr instanceof Array && friendLen) {
        for (let i = 0; i < friendLen; i++) {
          if (friendArr[i].uid === friendUid) {
            friendArr.splice(i, 1);

            await CategoryModel.updateCategoryList(uid, categoryArr);

            callback({
              code: 0,
              data: null,
              message: '成功删除好友'
            });

            return;
          }
        }
      }
    }
  }

  callback({
    isDelete: false
  });
}
