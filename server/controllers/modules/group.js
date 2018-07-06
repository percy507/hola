module.exports = {
  'create-group': createGroup,
  'get-group-info': getGroupInfo,
  'leave-group': leaveGroup,
  'dissolve-group': dissolveGroup
};

const CategoryModel = require('../../models/category');
const GroupModel = require('../../models/group');
const UserModel = require('../../models/user');

async function createGroup({
  uid,
  groupInfo
}, callback) {
  const myGroups = await GroupModel.where({
      ownerUid: uid,
      status: 'active'
    })
    .exec();

  // everyone can only create 5 group
  if (myGroups.length < 5) {
    const categoryArr = await CategoryModel.getCategoryListByUid(uid);
    const groupCategory = categoryArr[0];
    const gid = await GroupModel.createGroup({
      uid,
      groupInfo
    });

    groupCategory.groups.push({
      gid
    });

    await CategoryModel.updateCategoryList(uid, categoryArr);

    callback({
      code: 0,
      message: '创建群组成功'
    });
  } else {
    callback({
      code: 1,
      message: '创建群组失败，每个人最多能创建5个群组'
    });
  }
}

async function getGroupInfo(gid, callback) {
  let groupInfo = await GroupModel.where({
      gid
    })
    .lean()
    .exec();

  groupInfo = groupInfo[0];

  let members = groupInfo.members;
  const memberNum = members.length;

  for (let i = 0; i < memberNum; i++) {
    let member = members[i];
    const userInfo = await UserModel.getUserInfo(member.uid);

    member.avatar = userInfo.avatar;
    member.nickname = userInfo.nickname;
  }

  callback(groupInfo);
}

async function leaveGroup({
  uid,
  gid
}, callback) {
  const categoryArr = await CategoryModel.getCategoryListByUid(uid);
  const groupCategory = categoryArr[0];
  let groups = groupCategory.groups;

  groups.slice()
    .find((el, index) => {
      if (el.gid === gid) {
        groups.splice(index, 1);
        return true;
      }
    });

  await CategoryModel.updateCategoryList(uid, categoryArr);

  callback &&
    callback({
      code: 0,
      data: null,
      message: '成功退出群组'
    });
}

async function dissolveGroup({
  uid,
  gid
}, callback) {
  await leaveGroup({
    uid,
    gid
  });

  await GroupModel.where({
      gid
    })
    .update({
      status: 'dissolve'
    })
    .exec();

  callback({
    code: 0,
    data: null,
    message: '成功解散群组'
  });
}
