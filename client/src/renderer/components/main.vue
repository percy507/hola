<template>
  <div id="app">
    <div id="sidebar">
      <menu-bar></menu-bar>
      <div>
        <search-bar></search-bar>
        <div id="menu-content">
          <keep-alive>
            <router-view name="menus"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>

    <keep-alive>
      <router-view id="content"
                   name="contents"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MenuBar from './sidebar/menu-bar.vue';
import SearchBar from './sidebar/search-bar.vue';

export default {
  name: 'app',
  components: {
    MenuBar,
    SearchBar
  },
  data() {
    return {};
  },
  created() {
    this.$socket.emit('user-connect', this.$uid);

    this.getUserInfo();
    this.loadRecentChatList();
    this.receiveMessage();
  },
  methods: {
    getUserInfo() {
      if (!this.$uid) {
        this.$electron.ipcRenderer.send('logout');
        return;
      }

      this.$socket.emit('get-user-info', this.$uid, data => {
        this.$store.commit('SET_USERINFO', data);
      });
    },

    loadRecentChatList() {
      this.$store.commit('LOAD_RECENT_CHAT');
    },

    // handle the logic of receive new message
    receiveMessage() {
      // this.$socket.on('new-message', message => {
      //   const from = message.from;
      //   console.log(from);
      // });
    }
  }
};
</script>

<style lang="stylus">
#app {
  display: flex;
  width: $app-width;
  height: $app-height;
  background: $app-bg;
}

#sidebar {
  display: flex;
  width: $sidebar-width;
  height: $app-height;
}

#menu-content {
  width: $search-bar-width;
  height: $app-height - $search-bar-height;
  background: $menu-content-bg;
  overflow-y: auto;
}

#content {
  width: $content-width;
  height: $app-height;
}
</style>
