module.exports = {
  'search-contact': searchUserAndGroup,
  'add-friend': addFriend,
  'join-group': joinGroup
};

const CategoryModel = require('../../models/category');
const GroupModel = require('../../models/group');
const UserModel = require('../../models/user');

async function searchUserAndGroup({
  uid,
  keyword
}, callback) {
  const reg = new RegExp(keyword);
  let existFriendsIdArr = await CategoryModel.getAllExistFriendId({
    uid
  });
  let existGroupsIdArr = await CategoryModel.getAllExistGroupId({
    uid
  });
  let tempFriendArr = [];
  let tempGroupArr = [];
  let friendArr = [];
  let groupArr = [];

  tempFriendArr = await UserModel.where({})
    .select({
      uid: 1,
      avatar: 1,
      nickname: 1
    })
    .or([{
      uid: keyword
    }, {
      phone: keyword
    }, {
      nickname: reg
    }])
    .exec();

  // filter the added friends
  tempFriendArr.slice()
    .forEach((el, index) => {
      if (!existFriendsIdArr.includes(el.uid)) {
        friendArr.push(el);
      }
    });

  tempGroupArr = await GroupModel.where({
      status: 'active'
    })
    .select({
      gid: 1,
      avatar: 1,
      nickname: 1
    })
    .or([{
      gid: keyword
    }, {
      nickname: reg
    }])
    .exec();

  // filter the joined groups
  tempGroupArr.slice()
    .forEach((el, index) => {
      if (!existGroupsIdArr.includes(el.gid)) {
        groupArr.push(el);
      }
    });

  callback({
    code: 0,
    data: {
      friendArr,
      groupArr
    },
    message: ''
  });
}

async function addFriend({
  uid,
  friendUid
}, callback) {
  let categoryArr = await CategoryModel.getCategoryListByUid(uid);
  let category = categoryArr[1];
  let friendArr = category.friends;

  friendArr.push({
    uid: friendUid,
    alias: ''
  });

  await CategoryModel.updateCategoryList(uid, categoryArr);

  // TODO 自动生成一条系统消息，并发送给要添加的用户，以方便对方确认通过添加好友
  // generate a system message, send the target user
  // to notice the add-friend request

  callback({
    code: 0,
    data: null,
    message: 'Success to add friend'
  });
}

async function joinGroup({
  uid,
  gid
}, callback) {
  let categoryArr = await CategoryModel.getCategoryListByUid(uid);
  let category = categoryArr[0];
  let groupArr = category.groups;

  groupArr.push({
    gid
  });

  await CategoryModel.updateCategoryList(uid, categoryArr);
  await GroupModel.addNewMember({
    uid,
    gid
  });

  // TODO 自动生成一条系统消息，并发送给要添加的用户，以方便对方确认通过添加好友
  // generate a system message, send the target user
  // to notice the add-friend request

  callback({
    code: 0,
    data: null,
    message: 'Success to join group'
  });
}
