const mongoose = require('mongoose');
const GroupSchema = mongoose.Schema({
  gid: {
    type: String,
    required: [true, 'group-gid is required']
  },
  ownerUid: {
    type: String,
    required: [true, 'group-ownerUid is required']
  },
  status: {
    type: String,
    default: 'active'
  },
  avatar: {
    type: String,
    default: 'http://localhost:3000/upload/default/default-group-avatar.png'
  },
  nickname: {
    type: String,
    maxlength: 15
  },
  groupInfo: {
    type: String,
    maxlength: 150
  },
  tags: {
    type: Array,
    default: []
  },
  members: {
    type: Array,
    default: []
  }
}, {
  // auto generate `createdAt` and `updatedAt` field
  timestamps: true
});

GroupSchema.statics = {
  async createGroup({
    uid,
    groupInfo
  }) {
    // this equal to GroupModel
    let len = await this.count()
      .exec();
    let info = {
      gid: `g${10000 + len}`,
      ownerUid: uid,
      ...groupInfo
    };
    let group = new this(info);

    await group.save();

    return group.gid;
  },
  async addNewMember({
    uid,
    gid
  }) {
    let groups = await this.where({
        gid
      })
      .exec();
    let group = groups[0];
    let members = group.members.slice();

    members.push({
      uid,
      flag: ''
    });

    await this.where({
        gid
      })
      .update({
        members
      })
      .exec();
  }
};

module.exports = mongoose.model('Group', GroupSchema);
