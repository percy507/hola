const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'uid is required']
  },
  avatar: {
    type: String,
    default: 'http://localhost:3000/upload/default/default-user-avatar.png'
  },
  nickname: {
    type: String,
    maxlength: 15
  },
  signature: {
    type: String,
    maxlength: 50
  },
  gender: String,
  age: Number,
  phone: {
    type: String,
    required: [true, 'phone number is required']
  },
  email: String,
  tags: [{
    type: String
  }],
  address: {
    country: String,
    province: String,
    city: String,
    detail: String
  },
  birthTime: Date,
  selfIntro: {
    type: String,
    maxlength: 150
  },
  isOnline: Boolean
}, {
  // auto generate `createdAt` and `updatedAt` field
  timestamps: true
});

UserSchema.statics = {
  async registerUser(phone) {
    // this equal to UserModel
    let user = await this.where('phone')
      .equals(phone)
      .exec();

    user = user[0];

    if (!user) {
      let len = await this.count()
        .exec();
      let info = {
        uid: `u${10000 + len}`,
        phone: `${phone}`
      };

      user = new this(info);

      await user.save();
    }

    return user.uid;
  },
  async getUserInfo(uid) {
    let userInfo = await this.where({
        uid
      })
      .exec();

    userInfo = userInfo[0];

    return userInfo;
  }
};

module.exports = mongoose.model('User', UserSchema);
