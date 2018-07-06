const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({
  ownerUid: String,
  categories: [mongoose.Schema.Types.Mixed]
});

CategorySchema.statics = {
  async getCategoryListByUid(uid) {
    // this equal to CatogoryModel
    let category = await this.where({
        ownerUid: uid
      })
      .exec();

    category = category[0];

    if (!category) {
      category = new this({
        ownerUid: uid,
        categories: [{
            // cid = 0, always means [My Groups]
            cid: 0,
            groups: []
          },
          {
            // cid = 1, always means [Default Category]
            cid: 1,
            friends: []
          }
        ]
      });

      await category.save();
    }

    return category.categories;
  },

  async updateCategoryList(uid, category) {
    await this.where({
        ownerUid: uid
      })
      .update({
        categories: category
      })
      .exec();
  },

  async getFriendAliasFromCategory({
    uid,
    friendUid
  }) {
    let categoryArr = await this.getCategoryListByUid(uid);
    let alias = '';

    categoryArr.find(category => {
      if (category.cid !== 0) {
        let friendsArr = category.friends;
        let len = friendsArr.length;

        if (len) {
          return friendsArr.find(friend => {
            if (friend.uid === friendUid) {
              alias = friend.alias;

              return true;
            }
          });
        }
      }
    });

    return alias;
  },

  async getAllExistFriendId({
    uid
  }) {
    let totalFriendsArr = [];
    let category = await this.where({
        ownerUid: uid
      })
      .exec();

    category = category[0];

    let categoryArr = category.categories;
    let categoryLen = categoryArr.length;

    for (let m = 0; m < categoryLen; m++) {
      let category = categoryArr[m];

      if (category.cid !== 0) {
        let friendArr = category.friends;

        totalFriendsArr.push(...friendArr);
      }
    }

    // include user self
    totalFriendsArr.push({
      uid
    });

    return this.generateArrayByPropName(totalFriendsArr, 'uid');
  },

  async getAllExistGroupId({
    uid
  }) {
    let category = await this.where({
        ownerUid: uid
      })
      .exec();

    category = category[0];

    return this.generateArrayByPropName(category.categories[0].groups, 'gid');
  },

  generateArrayByPropName(originalArr = [], prop) {
    let arr = [];

    originalArr.forEach(el => {
      arr.push(el[prop]);
    });

    return arr;
  }
};

module.exports = mongoose.model('Category', CategorySchema);
