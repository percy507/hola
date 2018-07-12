import Vue from 'vue';
import VueExtend from './vue-extend';

import App from './app';
import router from './router';
import store from './store';

// import global initial style
import './styles/style.styl';

// register shortcut for opening devtools
// import { remote } from 'electron';

// remote.globalShortcut.register('CommandOrControl+Option+J', () => {
//   remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
// });

// window.addEventListener('beforeunload', () => {
//   remote.globalShortcut.unregisterAll();
// });

Vue.use(VueExtend);

// stop drag file to the app
document.addEventListener('dragover', function(event) {
  event.preventDefault();
});
document.addEventListener('drop', function(event) {
  event.preventDefault();
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
