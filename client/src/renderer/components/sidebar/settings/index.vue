<template>
  <div id="menu-settings">
    <function-item v-for="item in menuArr"
                   :key="item.id"
                   :config="item"
                   :isActive="activatedId === item.id"
                   @active-item="setActiveId"></function-item>
  </div>
</template>

<script>
import FunctionItem from '../_parts/function-item';

export default {
  name: 'menu-settings',
  components: {
    FunctionItem
  },
  data() {
    return {
      activatedId: 1,
      menuArr: []
    };
  },
  created() {
    this.menuArr.push(
      {
        id: 1,
        flag: 'ProfileSetting',
        icon: 'drivers-license-o',
        title: this.$lang.settings.user_profile_setting.main_title
      },
      {
        id: 2,
        flag: 'SoftwareSetting',
        icon: 'cogs',
        title: this.$lang.settings.software_setting.main_title
      },
      {
        id: 3,
        flag: 'SystemMessage',
        icon: 'info',
        title: this.$lang.settings.system_message.main_title
      }
    );
  },
  methods: {
    setActiveId(id) {
      this.activatedId = id;
    }
  }
};
</script>

<style lang="stylus">
#menu-settings {
}
</style>
