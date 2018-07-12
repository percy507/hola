<template>
  <div id="menu-bar">
    <div class="avatar">
      <img :src="userInfo.avatar">
    </div>

    <div class="menu">
      <router-link tag="span"
                   to="/app/chats"
                   exact-active-class="active"
                   class="icon-commenting"></router-link>
    </div>

    <div class="menu">
      <router-link tag="span"
                   to="/app/contacts"
                   exact-active-class="active"
                   class="icon-address-book"></router-link>
    </div>

    <div class="menu">
      <router-link tag="span"
                   to="/app/functions"
                   exact-active-class="active"
                   class="icon-th-large2"></router-link>
    </div>

    <div class="menu last-menu">
      <router-link tag="span"
                   to="/app/settings"
                   exact-active-class="active"
                   class="icon-cog"></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu-bar',
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return this.$store.state.Main.userInfo;
    }
  }
};
</script>

<style lang="stylus">
#menu-bar {
  position: relative;
  width: $menu-bar-width;
  height: $app-height;
  background: $menu-bar-bg;

  .avatar {
    width: 40px;
    height: 40px;
    margin: 30px auto 20px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    margin: 0 auto 16px;
    font-size: 20px;
    color: #525C68;
    cursor: pointer;

    span {
      transition: 0.1s;
    }

    :hover {
      color: #A7B0BB;
    }

    .active, .router-link-active {
      color: #A7B0BB;
    }
  }

  .last-menu {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    margin-bottom: 20px;
  }
}
</style>
