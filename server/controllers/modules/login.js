module.exports = {
  'get-authcode': getAuthCode,
  login: loginFunc,
  'is-allow-login': detectIsAllowLogin,
  logout: logoutFunc
};

const UserModel = require('../../models/user');
const redis = require('../../utils/redis');

async function getAuthCode(phone, callback) {
  const uid = await UserModel.registerUser(phone);
  const redisKey = `${uid}_authcode`;

  let authcode = await redis.get(redisKey);

  if (!authcode) {
    authcode = Math.floor(100000 + Math.random() * 900000);

    // expire time: 10 minutes
    await redis.set(redisKey, authcode, 'EX', 10 * 60);

    // TODO 为了方便，直接将验证码返回给前端
    callback({
      authcode
    });

    // 调用短信服务商接口发短信
    // call message service interface
    // do something
  } else {
    // TODO 为了方便，直接将验证码返回给前端
    callback({
      authcode
    });

    // 调用短信服务商接口发短信
    // call message service interface
    // do something
  }
}

async function loginFunc({
  phone,
  authcode
}, callback) {
  const uid = await UserModel.registerUser(phone);
  const serverAuthcode = await redis.get(`${uid}_authcode`);

  let isAllowLogin = false;

  if (Number.parseInt(serverAuthcode, 10) === Number.parseInt(authcode, 10)) {
    redis.set(`${uid}_can_login`, `${uid}`, 'EX', 7 * 24 * 60 * 60);

    isAllowLogin = true;
  }

  callback({
    isAllowLogin,
    uid
  });
}

async function detectIsAllowLogin(uid, callback) {
  let isAllowLogin = await redis.get(`${uid}_can_login`);

  callback({
    isAllowLogin: isAllowLogin ? true : false
  });
}

async function logoutFunc(uid, callback) {
  await redis.del(`${uid}_authcode`);
  await redis.del(`${uid}_can_login`);

  callback({
    isLogoutSuccess: true
  });
}
