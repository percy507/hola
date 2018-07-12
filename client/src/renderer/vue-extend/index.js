import electron from 'electron';
import Chance from 'chance';
import lang from '../lang';
import utils from '../utils';

const remote = electron.remote;
const uid = remote.getGlobal('store').get('uid');
const language = remote.getGlobal('store').get('lang');

function install(Vue) {
  // do not show the tips of the develop mode
  Vue.config.productionTip = false;

  /*
  * @desc: bind some useful methods to the prototype of Vue
  * @use: this.$[method]
  */
  Object.keys(utils).forEach(key => {
    Vue.prototype[`$${key}`] = utils[key];
  });

  /*
  * @desc: use electron
  * @use: this.$electron
  */
  Vue.prototype.$electron = electron;

  /*
  * @desc: multi-languages support
  * @use: this.$electron
  */
  Vue.prototype.$lang = lang[language || 'zh-CN'];

  /*
  * @desc: bind uid
  * @use: this.$uid
  */
  Vue.prototype.$uid = uid || null;

  /*
  * @desc: tools for generate random data
  * @use: this.$chance
  */
  Vue.prototype.$chance = new Chance();

  /*
  * @desc: socket.io for communicate
  * @use: this.$socket
  */
  Vue.prototype.$socket = remote.getGlobal('socket');

  /*
  * @desc: to store some config to local file
  * @use: this.$electronStore
  */
  Vue.prototype.$electronStore = remote.getGlobal('store');
}

export default install;
