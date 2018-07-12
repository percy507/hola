<template>
  <div class="software-setting">
    <div class="head">{{ contentTitle }}</div>

    <div class="content">
      <div>
        <select v-model="currentLanguage"
                @change="changeLanguage">
          <option value=""
                  disabled
                  selected
                  hidden>请选择软件语言</option>
          <option value="zh-CN">中文（简体）</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <button class="hola-logout"
                @click="logoutFunc">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'software-setting',
  data() {
    return {
      currentLanguage: ''
    };
  },
  computed: {
    contentTitle() {
      return this.$lang.settings.software_setting.main_title;
    },
    userInfo() {
      return this.$store.state.Main.userInfo;
    }
  },
  created() {
    this.currentLanguage = this.$electronStore.get('lang');
  },
  methods: {
    changeLanguage() {
      this.$electronStore.set('lang', this.currentLanguage);
      location.reload();
    },
    logoutFunc() {
      this.$socket.emit('logout', this.userInfo.uid, data => {
        if (data.isLogoutSuccess) {
          this.$socket.emit('user-disconnect', this.userInfo.uid);
          this.$electron.ipcRenderer.send('logout');
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.software-setting {
  .head {
    width: 100%;
    height: $search-bar-height;
    line-height: @height;
    padding: 0 0 0 20px;
    border-bottom: 1px solid #DDD;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
  }

  .content {
    &>div {
      margin: 20px;
    }
  }

  .hola-logout {
    display: block;
    height: 26px;
    line-height: @height;
    padding: 0 12px;
    border: none;
    border-radius: 4px;
    background: #E06C75;
    color: #FFF;
  }
}
</style>
